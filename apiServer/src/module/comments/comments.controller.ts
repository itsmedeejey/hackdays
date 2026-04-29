import { Request, Response } from "express";
import { commentService } from "./comments.services";

export const commentController = {
  // Create comment
  async createComment(req: Request, res: Response) {
    try {
      const { content, postId } = req.body;
      const userId = (req as any).user?.id;

      if (!content || !postId) {
        return res.status(400).json({
          message: "Content and postId are required"
        });
      }

      if (Array.isArray(postId)) {
        return res.status(400).json({ message: "Invalid postId" });
      }

      const comment = await commentService.createComment({
        content,
        userId,
        postId
      });

      return res.status(201).json(comment);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  // Get comments by post
  async getCommentsByPost(req: Request, res: Response) {
    try {
      let postId = req.params.postId;

      if (!postId || Array.isArray(postId)) {
        return res.status(400).json({ message: "Invalid postId" });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await commentService.getCommentsByPost({
        postId,
        page,
        limit
      });

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  //  Delete comment
  async deleteComment(req: Request, res: Response) {
    try {
      let commentId = req.params.commentId;
      const userId = (req as any).user?.id;

      if (!commentId || Array.isArray(commentId)) {
        return res.status(400).json({ message: "Invalid commentId" });
      }

      const result = await commentService.deleteComment(
        commentId,
        userId
      );

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
};