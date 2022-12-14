const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }
  
  type Book {
    authors: [String]
    description: String
    bookId: ID!
    image: String
    link: String
    title: String
  }
    
  input saveBookInput {
    bookId: ID
    authors: [String]
    description: String
    image: String
    link: String
    title: String
  }
    
  type Auth {
    token: ID
    user: User
  }
    
  type Query {
    users: [User]
    me: User
  }
    
  type Mutation {
    saveBook(input: saveBookInput!): User
    login(email: String!, password: String!): Auth
    createUser(username: String!, password: String!, email: String!): User
    deleteBook(bookId: ID!): User
  }
 `;

module.exports = typeDefs;