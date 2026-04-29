import { prisma } from "../../db/client";

interface CreateCommentInput {
  content: string;
  userId: string;
  postId: string;
}

interface GetCommentsInput {
  postId: string;
  page: number;
  limit: number;
}

export const commentService = {
  // Create comment
  async createComment(data: CreateCommentInput) {
    const { content, userId, postId } = data;

    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      throw new Error("Post not found");
    }

    return prisma.comment.create({
      data: {
        content,
        userId,
        postId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  },

  // Get comments by post
  async getCommentsByPost(params: GetCommentsInput) {
    const { postId, page, limit } = params;

    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { postId },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc"
        },
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }),
      prisma.comment.count({
        where: { postId }
      })
    ]);

    return {
      comments,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  },

  // Delete comment
  async deleteComment(commentId: string, userId: string) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await prisma.comment.delete({
      where: { id: commentId }
    });

    return { message: "Comment deleted successfully" };
  }
};