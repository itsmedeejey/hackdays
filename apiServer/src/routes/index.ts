import { Router } from 'express';
import authRouter from '../module/auth/auth.route';
import postRouter from '../module/post/post.router'
import searchRouter from '../module/search/search.router'
import recRouter from '../module/recommendation/rec.router'
import commentRoutes from '../module/comments/comments.route'
import chatRouter from '../module/chat/chat.router'

const router = Router();

router.use("/auth", authRouter)
router.use("/post", postRouter)
router.use("/search", searchRouter)
router.use("/recommend", recRouter)
router.use("/comments", commentRoutes);
router.use("/chat", chatRouter)

export default router;
