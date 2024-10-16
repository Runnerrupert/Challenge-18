const typeDefs = `
 type User {
  _id: ID
  username: String
  email: String
  password: String
  savedBooks: [Book]
 }

 type Book {
  bookId: ID
  title: String
  authors: [String]
  description: String
  image: String
  link: String
 }

 input BookInput {
   bookId: ID!
   title: String!
   authors: [String]!
   description: String
   image: String
   link: String
 }

 input UserInput {
  username: String!
  email: String!
  password: String!
 }

 type Auth {
  token: ID!
  user: User
 }

 type Query {
  searchBooks(input: String!): [Book]
  user(username: String!): User
  me: User
 }

 type Mutation {
    createUser(input: UserInput!): Auth
    login(email: String!, password: String!): Auth
    saveBook(book: BookInput!): User
    deleteBook(bookId: ID!): User
 }
`;

export default typeDefs;