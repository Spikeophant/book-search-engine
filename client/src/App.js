import React from 'react';
//import aplllo stuff here.
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';


//I was looking at a bad howto apparently, I was talking to another classmate and they linked me to official docs and
//I realized I did it totally wrong, I should check dates on tutorials I find/watch on the internet.
//read these https://www.apollographql.com/docs/react/api/link/introduction
//create httplink for authentication middleware and headers.
const httpLink = createHttpLink({
  uri: '/graphql',
});

//set context.
const authContext = setContext((_, { headers }) => {
  //get id token.
  const token = localStorage.getItem('id_token');
  return {
    //build new headers out of the old ones plus authorization.
    headers: {
      //unpack headers.
      ...headers,
      //add authorization header to the other ones.
      authorization: token? `Bearer ${token}` : '',
    },
  };
});

//now finally setup client now that we have the authorization token.
const apolloClient = new ApolloClient({
  //combine the httpLink and the context we set.
  link: authContext.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    //wrap the whole thing in the apolloprovider so they have access to the stuff we setup here.
    <ApolloProvider client={apolloClient}>
    <Router>
      <>
        <Navbar />
        <Routes>
          <Route 
            path='/' 
            element={<SearchBooks />} 
          />
          <Route 
            path='/saved' 
            element={<SavedBooks />} 
          />
          <Route 
            path='*'
            element={<h1 className='display-2'>Wrong page!</h1>}
          />
        </Routes>
      </>
    </Router>
  </ApolloProvider>
  );
}

export default App;
