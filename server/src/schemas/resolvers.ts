import User, { UserDocument } from '../models/User.js';
import { signToken, AuthenticationError } from '../services/auth.js';

interface LoginUserArgs {
    email: string;
    password: string;
}

interface AddBookArgs {
    userId: string;
    bookId: string;
}

interface RemoveBookArgs {
    userId: string;
    bookId: string;
}



const resolvers = {
  Query: {
    user: async(_parent: any, { username }: UserDocument) => {
        return User.findOne({ username })
    }
    
  },
  Mutation: {
    createUser: async (_parent: any, args: any) : Promise<UserDocument | null> => {
        const user = await User.create(args);
        return user;
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
    // saveBook
  },
};

export default resolvers;
