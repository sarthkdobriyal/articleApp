import express from 'express';
import { authMiddleware } from '../utils/middleware';
import { createArticle, getAllArticles, getCredits } from '../controllers/articleController';


const router = express.Router();

router.get('/list', authMiddleware, getAllArticles);
router.post('/create', authMiddleware, createArticle);
router.get('/getCredits', authMiddleware, getCredits);

export default router;