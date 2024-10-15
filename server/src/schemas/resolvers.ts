import User from '../models/User.js';
import { signToken, AuthenticationError } from '../services/auth.js';

interface LoginUserArgs {
    email: string;
    password: string;
}

interface UserArgs {
    username: string;
}

interface SearchBookArgs {
    input:{
        query: string;
    }
}

interface AddBookArgs {
    userId: string;
    bookId: string;
}

interface RemoveBookArgs {
    userId: string;
    bookId: string;
}

interface AddUserArgs {
    input:{
        username: string;
        email: string;
        password: string;
    }
}

interface GoogleAPIVolumeInfo {
    title: string;
    authors: string[];
    description: string;
    imageLinks: {
      smallThumbnail: string;
      thumbnail: string;
    };
} 

interface GoogleAPIBook {
    id: string;
    volumeInfo: GoogleAPIVolumeInfo;
}

const resolvers = {
  Query: {
    searchBooks: async(_parent: any, { input } : SearchBookArgs) => {
        
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${input}`);

        if (!response.ok) {
            throw new Error('Failed to fetch book');
        }
        const data = await response.json();

        return data.items.map((book: GoogleAPIBook) => ({
            bookId: book.id,
            authors: book.volumeInfo.authors || ['No author to display'],
            title: book.volumeInfo.title,
            description: book.volumeInfo.description,
            image: book.volumeInfo.imageLinks?.thumbnail || '',
        }));
    },

    user: async (_parent: any, { username }: UserArgs) => {
        return User.findOne({ username });
    },
    
    me: async (_parent: any, _args: any, context: any) => {
        if (context.user) {
          return User.findOne({ _id: context.user._id });
        }
        throw new AuthenticationError('Could not authenticate user.');
    },
  },
  Mutation: {
    createUser: async (_parent: any, { input } : AddUserArgs) => {
        console.log("Recieved input for createUser:", input);
        try {
            const user = await User.create({ ...input });
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        } catch (error) {
            console.error("Error creating user:", error);
            throw new Error("Failed to create user");
        }
    },

    login: async (_parent: any, { email, password } : LoginUserArgs) => {
        const user = await User.findOne({ email });
        if (!user) {
            throw new AuthenticationError('Could not authenticate user.');
        }

        const correctPassword = await user.isCorrectPassword(password);

        if (!correctPassword) {
            throw new AuthenticationError('Could not authenticate user.');
        }
        const token = signToken(user.username, user.email, user._id);

        return { token, user };
    },

    saveBook: async (_parent: any, { userId, bookId }: AddBookArgs , context: any) => {
        if (context.user) {
            return User.findOneAndUpdate(
                { _id: userId },
                { $addToSet: { savedBooks: bookId}},
                { new: true, runValidators: true }
            );
        }
        throw AuthenticationError;
    },

    deleteBook: async (_parent: any, { userId, bookId }: RemoveBookArgs, context: any) => {
        if (context.user) {
            return User.findOneAndUpdate(
                { _id: userId },
                {
                    $pull: {
                        savedBooks: { id: bookId }
                    },
                },
                { new: true }
            );
        }
        throw AuthenticationError;
    }
  },
};

export default resolvers;
