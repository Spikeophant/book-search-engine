const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    //pass in parent (_) arguments and the current users context.
    me: async (_, args, context) => {
      if (context.user) {
        //return the password and __v
        const user = await User.findById(context.user._id).select('-__v -password');
        return user;
      }
      //errrrrrror
      throw new AuthenticationError('Unauthorized');
    },
    users: async (_) => {
      const users = await User.find({});
      return users;
    }
  },
  Mutation: {
    //save book, pass parent, saveBookInput, and the user (from current context.)
    saveBook: async (_, { saveBookInput }, {user}) => {
      if (user) {
        //update user if we have one.
        const update = await User.findByIdAndUpdate({ _id: user.id },
          //add to set adds teh input book to the current array of books
          { $addToSet: { savedBooks: input } },
          //return the updated document, and validate.
          { new: true, runValidators: true }
        );
        //return here instead of inline so we actually await.
        return update;
      }
      throw new AuthenticationError('Unauthorized');
    },
    //login take parent and email/password.
    login: async (_, { email, password }) => {
      //retrieve the user here.
      const user = await User.findOne({ email });
      if (!user) {
        //don't say what's actually wrong here so we don't leak emails.
        throw new AuthenticationError('Incorrect email or password.  Please try again.');
      }
      //if this isn't the correct password throw authentication error.
      //break into var and if so we can actually await this always gets me once.
      const isCorrectPassword = await user.isCorrectPassword(password);
      if (!isCorrectPassword) {
        throw new AuthenticationError('Incorrect email of password.  Please try again.');
      }
      //if the email and password match a user, return the token and user.
      return { token: signToken(user), user };
    },
    createUser: async (_, args) => {
      const user = await User.create(args);
      //generate jwt.
      const token = signToken(user);
      //return both user and jwt.
      return { token, user};
    },
    deleteBook: async (_, { bookId }, {user}) => {
      if (user) {
        const update = await User.findByIdAndUpdate({ _id: user.id },
          //so mongoose has another cool builtin $pull to just take from the array, so I don't have to
          //built a function and pass the whole updated object set back in.
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true, runValidators: true }
        );
        return update;
      }
      throw new AuthenticationError('Unauthorized');
    }
  }
}

module.exports = resolvers;