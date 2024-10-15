import { gql } from '@apollo/client';

export const CREATE_USER = gql`
    mutation createUser($input: UserInput!) {
        createUser(input: $input) {
            token
            user {
                _id
                username
                email    
            }
        }
    }
`;

export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                username
                email    
            }
        }
    }
`;

export const SAVE_BOOK = gql`
    mutation saveBook($bookId: ID!) {
        saveBook(bookId: $bookId) {
            _id
            savedBooks {
                bookId
                title
                authors
                description
                image
                link    
            }
        }
    }
`;

export const DELETE_BOOK = gql`
    mutation deleteBook($bookId: ID!) {
        createUser(bookId: $bookId) {
            _id
            savedBooks {
                bookId
                title
                authors
                description
                image
                link    
            }
        }
    }
`;