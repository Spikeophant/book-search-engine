const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }
  
  type Book {
    authors: [String]
    description: String
    bookId: String
    image: String
    link: String
    title: String
  }
    
  type saveBookInput {
    bookId: String
    authors: [String]
    description: String
    image: String
    link: String
    title: String
  }
    
  type Auth {
    token: ID!
    user: User
  }
    
  type Query {
    users: [User]
    me: User
    }
    
  type Mutation {
    saveBook(_id: ID!): Book
    login(email: String!, password: String!): User
    createUser(username: String!, password: String!, email: String!): User
    deleteBook(_id: ID!, bookId: ID!): User
  }
 `;

module.exports = typeDefs;