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
    }
  },
  Mutation: {
    createUser: async (_, args) => {
      const user = await User.create(args);
      //generate jwt.
      const token = signToken(user);
      //return both user and jwt.
      return { token, user};
    }
  }
}

module.exports = resolvers;