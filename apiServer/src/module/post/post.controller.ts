"use strict";

import { Request, Response } from "express";
import uploadOnCloudinary from "../../utils/cloudinary";
import { PostService } from "./post.service";
import { v2 as cloudinary } from "cloudinary";

const safeParse = (value?: string) => {
  try {
    return value ? JSON.parse(value) : undefined;
  } catch {
    return undefined;
  }
};

export const PostController = {
  async uploadPost(req: Request, res: Response) {
    let uploadedImages: {
      url: string;
      publicId: string;
      order?: number;
    }[] = [];

    try {
      const userId = req.user.id;

      const parsedBody = {
        ...req.body,
        location: safeParse(req.body.location),
        metadata: safeParse(req.body.metadata),
        event: safeParse(req.body.event),
        service: safeParse(req.body.service),
      };

      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No images uploaded" });
      }

      //  upload images
      uploadedImages = await Promise.all(
        files.map(async (file, index) => {
          const res = await uploadOnCloudinary(file.path);

          return {
            url: res.url,
            publicId: res.publicId,
            order: index,
          };
        })
      );

      const finalBody = {
        ...parsedBody,
        images: uploadedImages,
        userId,
      };

      const post = await PostService.createPost(finalBody);


      if (!post) {
        return res.status(500).json({
          error: "Post creation failed",
        });
      }

      //-----------------------------------------------
      // everytime a new post is created we send a post req to the rec. service /refresh-cache endpoint
      // so the service can query the new data from our db 
      // 
      if (post) {
        fetch(`${process.env.PYTHON_API_URL}/refresh-cache`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }).catch((err) => {
          console.error("Recommendation service failed:", err);
        });
      }
      //-------------------------------


      return res.status(201).json({
        message: "Post processed successfully",
        post,
      });
    } catch (error) {
      console.error("UploadPost error:", error);
      // rollback only if images exist
      if (uploadedImages.length > 0) {
        await Promise.allSettled(
          uploadedImages.map((img) =>
            cloudinary.uploader.destroy(img.publicId)
          )
        );
      }
      return res.status(500).json({
        error: "Failed to upload post",
      });
    }
  },

  async getAllPost(req: Request, res: Response) {
    try {
      const posts = await PostService.getAllPost();

      return res.status(200).json({
        message: "Posts fetched successfully",
        data: posts,
      });

    } catch (error) {
      console.error("getAllPost error:", error);

      return res.status(500).json({
        error: "Failed to fetch posts",
      });
    }
  },


  async getPostById(req: Request, res: Response) {
    try {
      //  const { id } = req.params;
      const id = req.params.id as string;
      const post = await PostService.getPostById(id);

      if (!post) {
        return res.status(404).json({
          error: "Post not found",
        });
      }

      return res.status(200).json({
        message: "Post fetched successfully",
        data: post,
      });

    } catch (error) {
      console.error("getPostById error:", error);

      return res.status(500).json({
        error: "Failed to fetch post",
      });
    }
  },



};
