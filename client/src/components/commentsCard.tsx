"use client";

import { useEffect, useState } from "react";
import PostCommentCard from "./postCommentCard";
import api from "@/config/axios";
import { useParams } from "next/navigation";

type Comment = {
  id: string;
  postId: string;
  content: string;
  user: {
    id: string;
    name: string;
  };
};

export default function CommentsCard() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams()
  const postId = params.id as string;

  const [total, setTotal] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`/api/comments/post/${postId}`);
        setComments(res.data.comments);
        setTotal((res.data.total))
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  // optimistic update
  const addComment = async (content: string) => {
    const newComment: Comment = {
      id: `temp-${Date.now()}`,
      postId: postId,
      content,
      user: {
        id: "temp",
        name: "You",
      },
    };

    setComments((prev) => [newComment, ...prev]);

    try {
      const res = await api.post("/api/comments/create",
        {
          postId: postId,
          content: content,
        });

    } catch (err) {
      console.error(err);
    }
  };
  const getInitial = (name: string) =>
    name.charAt(0).toUpperCase();

  return (
    <div className="max-w-full mx-auto mt-15 space-y-4">
      {/* Post content */}
      <h1 className="font-bold text-center text-2xl">Reviews</h1>
      <PostCommentCard onSubmit={addComment} />

      <div className="bg-white p-3 rounded-xl shadow space-y-2">

        <div className="font-semibold"> Total reviews: {total} </div>
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-gray-500">No reviews yet</p>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg"
            >
              <div className="w-8 h-8 p-3 flex items-center justify-center rounded-full bg-black text-white text-sm font-semibold">
                {getInitial(c.user?.name || "U")}
              </div>

              <div>
                <p className="text-sm font-semibold">{c.user?.name || "Unknown"}</p>
                <p className="text-sm text-gray-700">{c.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
