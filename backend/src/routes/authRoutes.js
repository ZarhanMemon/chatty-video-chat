import express from 'express';
import { login, logout, signup , updateProfile, authCheck } from '../controllers/authController.js';
import { protectRoute } from '../middlewares/protectAuth_middleware.js';
 

const router = express.Router();


router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);




router.put('/updateProfile',protectRoute, updateProfile);

 
router.get('/check',protectRoute, authCheck);


export default router;
