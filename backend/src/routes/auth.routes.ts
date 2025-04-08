import { Router } from 'express';
import { register, login, getProfile, logout } from '../controllers/auth.controller';
import { requestOTP, verifyOTP } from '../controllers/auth.controller';

import { authenticate } from '../middleware/auth.middleware';
import {editProfile } from '../controllers/auth.controller';
import upload from "../middleware/upload.middleware";


const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.post('/logout', authenticate, logout);
router.post('/forgot-password', requestOTP);
router.post('/verify-otp', verifyOTP); 
// Edit profile (authenticated user only)
router.put(
    '/user/edit',
    authenticate,
    upload.fields([
      { name: 'avatar', maxCount: 1 },
      { name: 'coverPhoto', maxCount: 1 },
    ]),
    editProfile
  );
  


export default router; 