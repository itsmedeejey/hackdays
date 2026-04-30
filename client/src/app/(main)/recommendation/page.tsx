"use client";

import RecInputCard from "@/components/recInputCard";
import PostCard from "@/components/postCard";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { useRecommendationStore } from "@/store/useRecommendationStore";

import { useEffect } from "react";

export default function Recomendation() {
  const router = useRouter();

  const user = useUserStore((s) => s.user);
  const isLoading = useUserStore((s) => s.isLoading);

  const result = useRecommendationStore((s) => s.result);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) return null;
  if (!user) return null;

  const sortedResults = [...(result || [])].sort(
    (a, b) => b.final_score - a.final_score
  );
  console.log("nothing", sortedResults)

  return (
    <div className="flex flex-col items-center justify-center mt-15 w-screen px-4">

      <div className="font-bold text-xl">
        Get Personalized Recommendation
      </div>

      <div className="mt-10">
        <RecInputCard />
      </div>

      <div className="w-full max-w-6xl">

        {result && result.length === 0 && (
          <div className="mt-10 text-center text-gray-500">
            No recommendations found
          </div>
        )}

        {result && result.length > 0 && (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10">
            {sortedResults.map((post) => (
              <Link key={post.id} href={`/post/${post.id}`}>
                <div>
                  <PostCard
                    title={post.title}
                    name={"Unknown"}
                    postType={post.postType}

                    image={
                      post.images?.[0]?.url &&
                        post.images[0].url !== "#"
                        ? post.images[0].url
                        : "/img/default.jpg"
                    }
                  />

                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
