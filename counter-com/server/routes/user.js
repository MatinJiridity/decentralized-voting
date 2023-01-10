import express from 'express';

import { signin, signup, getUserInfo, commit, createGroup, getCommitments } from "../controllers/user.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post('/signin', signin);
router.post('/signin/admin', signin);
router.post('/signup', signup);
router.get('/:id/userInfo', getUserInfo);
router.get('/createGroup', createGroup);
router.patch('/:id/commit', commit);
router.get('/commitments', getCommitments);

export default router;