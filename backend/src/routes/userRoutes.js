import express from 'express';
import { protectRoute } from '../middlewares/protectAuth_middleware.js';
import {
    getRecommendUsers,    // ← make sure this matches your controller export
  getFriends,             // ← ditto
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequests,
  getOutgoingFriendReqs,
  rejectFriendRequest
} from '../controllers/userController.js';

const router = express.Router();

// Protect every route in here
router.use(protectRoute);

// “Meet New Learners”
router.get('/', getRecommendUsers);

// “Your Friends”
router.get('/friends', getFriends);

// Incoming & outgoing friend‐requests
router.get('/friend-requests', getFriendRequests);
router.get('/outgoing-friend-requests', getOutgoingFriendReqs);

// Send / Accept friend requests
router.post('/friend-request/:id', sendFriendRequest);
router.put('/friend-request/:id/accept', acceptFriendRequest);
router.post("/friend-request/:id/reject",rejectFriendRequest)

export default router;
