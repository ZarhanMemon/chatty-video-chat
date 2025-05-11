// src/controllers/userController.js

import User from "../modules/userModels.js";
import FriendRequest from "../modules/FriendRequest.js";

/**
 * Recommend all other users except yourself and your existing friends.
 */
export async function getRecommendUsers(req, res) {
  try {
    const currentUserId = req.user._id.toString();

    // Load current user's friends from the database
    const me = await User.findById(currentUserId).select("friends");
    const friendIds = (me.friends || []).map((id) => id.toString());

    // Exclude yourself and your friends
    const recommendations = await User.find({
      _id: { $nin: [currentUserId, ...friendIds] },
    }).select("name profilePic lastSeen ")

    return res.status(200).json(recommendations);
  } catch (error) {
    console.error("Error in getRecommendedUsers controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * Get current user's friends list (populated with their info).
 */
export async function getFriends(req, res) {
  const currentUserId = req.user._id.toString();

  const user = await User.findById(currentUserId)
    .select("friends")
    .populate("friends", "name profilePic lastSeen ");

  const friends = (user.friends || []).map(f => ({
    _id: f._id,
    name: f.name,
    profilePic: f.profilePic,
    lastSeen: f.lastSeen,
  }));

  console.log(friends)

  return res.status(200).json(friends);
}

/**
 * Send a friend request from current user to another user.
 */
export async function sendFriendRequest(req, res) {
  try {
    const senderId = req.user._id.toString();
    const recipientId = req.params.id;

    // Prevent self-request
    if (senderId === recipientId) {
      return res.status(400).json({ message: "Cannot send request to yourself" });
    }

    // Verify recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // Prevent if already friends
    if (recipient.friends.map((id) => id.toString()).includes(senderId)) {
      return res.status(400).json({ message: "You are already friends" });
    }

    // Prevent duplicate or reverse requests
    const existing = await FriendRequest.findOne({
      $or: [
        { sender: senderId, recipient: recipientId },
        { sender: recipientId, recipient: senderId },
      ],
      status: { $ne: "rejected" },  // 👈 Skip rejected,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "A friend request already exists between you" });
    }

    // Create the friend request
    const friendRequest = await FriendRequest.create({
      sender: senderId,
      recipient: recipientId,
      status: "pending",
    });

    return res.status(201).json(friendRequest);

  } catch (error) {
    console.error("‼ sendFriendRequest failed:", {
      message: error.message,
      stack: error.stack,
      params: req.params,
      user: req.user,
    });
    return res.status(500).json({ message: "Internal Server hello" });
  }
}

/**
 * Accept an incoming friend request and update both users' friend lists.
 */
export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // Verify the current user is the recipient
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // add each user to the other's friends array
    // $addToSet: adds elements to an array only if they do not already exist.
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Error in acceptFriendRequest controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}


// Reject friend request

export async function rejectFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // Verify the current user is the recipient
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to reject this request" });
    }

    friendRequest.status = "rejected";
    await friendRequest.save();

    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    console.error("Error in rejectFriendRequest controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}



/**
 * Get incoming (pending) and accepted outgoing friend requests.
 */
export async function getFriendRequests(req, res) {
  try {
    const userId = req.user._id.toString();

    // Incoming pending requests
    const incoming = await FriendRequest.find({
      recipient: userId,
      status: "pending",
    }).populate("sender", "name profilePic lastSeen ");

    // Outgoing accepted requests
    const outgoing = await FriendRequest.find({
      sender: userId,
      status: "accepted",
    }).populate("recipient", "name profilePic lastSeen  ");

    //Rejecting Request
    const rejecting = await FriendRequest.find({
      sender:userId,
      status: "rejected"
    }).populate("recipient", "name profilePic lastSeen  ");

    return res.status(200).json({ incoming, outgoing ,rejecting});
  } catch (error) {
    console.error("Error in getFriendRequests controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * Get outgoing (pending) friend requests only.
 */
export async function getOutgoingFriendReqs(req, res) {
  try {
    const userId = req.user._id.toString();

    const outgoingRequests = await FriendRequest.find({
      sender: userId,
      status: "pending",
    }).populate("recipient", "name profilePic lastSeen ");

    return res.status(200).json(outgoingRequests);
  } catch (error) {
    console.error("Error in getOutgoingFriendReqs controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
