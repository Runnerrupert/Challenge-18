import User from '../models/User.js';
import { signToken, AuthenticationError } from '../services/auth.js';

interface LoginUserArgs {
    email: string;
    password: string;
}

interface UserArgs {
    username: string;
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

const resolvers = {
  Query: {
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
        const user = await User.create({ ... input });
        const token = signToken(user.username, user.email, user._id);
        return { token, user };
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
