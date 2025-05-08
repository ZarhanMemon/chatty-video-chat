import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min_length: 6,
    },
    profilePic: {
        type: String,
        default: "/avatar.png"
    },

    lastSeen: {
        type: Date,
        default: Date.now
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],

},

    {
        timestamps: true // <-- Use timestamps instead of timestamp
    }

);

const User = mongoose.model("User", userSchema);
export default User;