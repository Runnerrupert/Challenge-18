import { gql } from '@apollo/client';

export const QUERY_USER = gql`
    query user($username: String!) {
        user(username: $username) {
            _id
            username
            email
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

export const QUERY_ME = gql`
    query me {
        me {
            _id
            username
            email
            savedBooks {
                bookId
                title
                authors
                description
                image
            }
        }
    }
`;

export const SEARCH_BOOK = gql`
    query searchBooks($input: String!) {
        searchBooks(input: $input) {
            bookId
            authors
            title
            description
            image
            link
        }
    }
`;