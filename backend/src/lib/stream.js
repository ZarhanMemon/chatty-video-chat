import { StreamChat } from 'stream-chat';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
    console.error('STREAM_API_KEY and STREAM_API_SECRET must be set in .env file');
    process.exit(1);
}

const serverClient = StreamChat.getInstance(apiKey, apiSecret);

/**
 * Create or update a Stream Chat user.
 *
 * @param {Object} userData — must include at least { id, name, image? }
 * @returns {Object} the created/updated user data
 */
export const createStreamUser = async (userData) => {
    try {
        console.log("Creating Stream user with id =", userData.id);
        // Use upsertUsers (plural), not upsertUser
        await serverClient.upsertUsers([userData]);
        return userData;
    } catch (err) {
        console.error("Error upserting Stream user:", err);
        throw err;
    }
};

/**
 * Generate a Stream Chat token for a given user ID.
 *
 * @param {string} userId — the user’s unique Stream Chat ID
 * @returns {string} a JWT token scoped to that user
 */
export const generateStreamToken = (userId) => {
    try {

        return serverClient.createToken(userId.toString());
    } catch (error) {
        console.error('Error generating Stream token:', error);
        throw error;
    }
};
