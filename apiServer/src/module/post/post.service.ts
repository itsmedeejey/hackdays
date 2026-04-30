import { CreatePostRequest } from "./types/post.type";
import { prisma } from "../../db/client";

export const PostService = {

  // CREATE POST
  async createPost(body: CreatePostRequest & {
    userId: string;
    images?: { url: string; publicId: string; order?: number }[];
  }) {

    if (!body.images || body.images.length === 0) {
      throw new Error("At least one image is required");
    }

    if (body.postType === "EVENT" && !body.event) {
      throw new Error("EVENT requires event data");
    }

    if (body.postType === "SERVICE" && !body.service) {
      throw new Error("SERVICE requires service data");
    }

    let eventData;

    if (body.postType === "EVENT") {
      const start = new Date(body.event!.startTime);
      const end = new Date(body.event!.endTime);
      const max = body.event!.budgetMax;
      const min = body.event!.budgetMin;

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error("Invalid event dates");
      }

      eventData = {
        create: {
          startTime: start,
          endTime: end,
          budgetMin: min,
          budgetMax: max,
        }
      };
    }

    try {
      const post = await prisma.post.create({
        data: {
          user: {
            connect: { id: body.userId },
          },

          title: body.title,
          description: body.description,
          postType: body.postType,
          state: body.state,
          metadata: body.metadata ?? undefined,

          location: body.location
            ? { create: body.location }
            : undefined,

          images: {
            create: body.images.map(img => ({
              url: img.url,
              publicId: img.publicId,
              order: img.order ?? null,
            })),
          },

          event: eventData,

          service:
            body.postType === "SERVICE"
              ? { create: body.service! }
              : undefined,
        },
      });

      return post;

    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  // // GET ALL POSTS
  // async getAll() {
  //
  //   try {
  //     const posts = await prisma.post.findMany({
  //       orderBy: {
  //         createdAt: "desc",
  //       }
  //     })
  //     return posts;
  //   } catch (err) {
  //     console.log(err);
  //     throw err;
  //   }
  // },
  //

  async getAllPost() {
    try {
      const posts = await prisma.post.findMany({
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          title: true,
          location: true,
          event: true,
          postType: true,
          service: true,
          createdAt: true,

          user: {
            select: {
              name: true,
            },
          },

          images: {
            orderBy: {
              order: "asc",
            },
            select: {
              url: true,
              order: true,
            },
          },
        },
      }); return posts;

    } catch (err) {
      console.log(err);
      throw err;
    }
  },


  // GET POST BY ID
  async getPostById(id: string) {
    try {
      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          images: {
            orderBy: {
              order: "asc",
            },
          },
          location: true,
          event: true,
          service: true,
        },
      });

      return post;

    } catch (err) {
      console.log(err);
      throw err;
    }
  }

};
