import jwt from 'jsonwebtoken';
import User from '../modules/userModels.js';
import dotenv from 'dotenv';
 
export const protectRoute = async (req, res, next) => {

    try {

        const token = req.cookies.jwt;

        // Check if the token is present in the request cookies
        if (!token) {
            return res.status(401).json({
                message: 'Not authorized, no token',
            });
        }

        dotenv.config(); // Load environment variables from .env file


        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({
                message: 'Not authorized, token failed',
            });
        }

        // Find the user associated with the token
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({
                message: 'Not authorized, no user found',
            });
        }
        // Attach the user to the request object for use in the next middleware or route handler
        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({
            message: 'Not authorized, token failed',
        });

    }

}