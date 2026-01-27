import express from 'express';
import {
  getUserByUsername,
  getMessageByKeyword,
  getUserById,
} from '../controllers/search.controller.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

router.get('/messages/:id', protectRoute, getMessageByKeyword);
router.get('/user/:userId', protectRoute, getUserById);
router.get('/username/:username', protectRoute, getUserByUsername);

export default router;
