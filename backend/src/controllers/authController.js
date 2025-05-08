import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../modules/userModels.js';
import { generateToken } from '../lib/utiles.js';
import { createStreamUser } from '../lib/stream.js';
import cloudinary from '../lib/cloudinary.js';

dotenv.config(); // Load .env variables

// ===============================
// Signup Controller
// ===============================
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Create Stream user
        try {
            await createStreamUser({
                id: newUser._id.toString(),
                name: newUser.name,
                image: newUser.profilePic,
            });
        } catch (err) {
            console.error("Stream upsert failed:", err);
            // Optional: rollback or log
        }

        // Generate JWT token and set cookie
        generateToken(newUser._id, res);

        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            profilePic: newUser.profilePic,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt,
        });
    } catch (error) {
        console.error("Error in signup:", error);
        return res.status(500).json({ message: "Internal server error during signup" });
    }
};

// ===============================
// Login Controller
// ===============================
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid Credential' });

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid Password' });
        }

        await user.save();

        generateToken(user._id, res);

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    } catch (error) {
        console.error('Error in login:', error.message);
        return res.status(500).json({ error: 'Internal server error during login' });
    }
};

// ===============================
// Logout Controller
// ===============================
// controllers/authController.js
export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt");

        const userId = req.user?._id;

        if (userId) {
            const user = await User.findById(userId);
            if (user) {
                user.lastSeen = new Date();
                await user.save();


                return res.status(200).json({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    profilePic: user.profilePic,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    lastSeen: user.lastSeen,
                });
            }
        }

        // If no user found
        return res.status(200).json({ message: "Logged out successfully." });

    } catch (error) {
        console.error("Error in logout:", error.message);
        return res.status(500).json({
            error: "Internal server error during logout",
        });
    }
};


// ===============================
// Update Profile Controller
// ===============================
export const updateProfile = async (req, res) => {
    try {
        const { profilePic, name } = req.body;
        const userId = req.user._id;

        if (!profilePic && !name) {
            return res.status(400).json({ message: "Either profilePic or name is required" });
        }

        let updateData = {};

        if (profilePic) {
            const uploadResponse = await cloudinary.uploader.upload(profilePic);
            updateData.profilePic = uploadResponse.secure_url;
        }

        if (name) {
            updateData.name = name;
        }


        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        await createStreamUser({
            id: updatedUser._id.toString(),
            name: updatedUser.name,
            image: updatedUser.profilePic,
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in updateProfile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ===============================
// Auth Check Controller
// ===============================
export const authCheck = (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        return res.status(200).json(req.user);
    } catch (error) {
        console.error("Error in authCheck controller:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



