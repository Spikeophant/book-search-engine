import { gql } from '@apollo/client';

//save book, matching the mutations in our typedefs and resolves on the server side.
// and matching on the client side the existing naming for the api lib.
//bookData matches where we'll end up calling this on the front end, in Seachbooks
export const SAVE_BOOK = gql`
  mutation saveBook($bookData: saveBookInput!) {
  saveBook(bookData: $bookData) {
    _id
    username
    email
    bookCount
    savedBooks {
      authors
      description
      bookId
      image
      link
      title
      }
    }
  }
`;

//login user as above matching the mutation, and matching the existing api call name.
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;


//add user as above, matching all the way through the application.
export const ADD_USER = gql`
  mutation createUser($username: String!, password: String!, email: String!) {
    createUser(username: $username, password: $password, email: $email) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const REMOVE_BOOK = gql`
  mutation deleteBook($bookId: String!) {
    deleteBook(bookId: $bookId) {
      _id
      username
      email
      bookCount
      savedBooks {
        authors
        description
        bookId
        image
        link
        title
      }
    }
  }
`;