import { Router } from "express";
import { commentController } from "./comments.controller";
import { authMiddleware } from "../../middleware/auth.middleware";;

const route = Router();

// Create comment
route.post("/", authMiddleware, commentController.createComment);

// Get comments by post
route.get("/post/:postId", commentController.getCommentsByPost);

// Delete comment
route.delete("/:commentId", authMiddleware, commentController.deleteComment);

export default route;