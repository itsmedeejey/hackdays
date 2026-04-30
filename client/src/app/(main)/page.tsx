"use client";

import PostCard from "@/components/postCard";
import { useEffect, useState } from "react";
import api from "@/config/axios";
import { GetPostsResponse, Post } from "@/types/getAllPost.type";
import Link from "next/link";
import PlatformIntroCard from "@/components/introCard";
import AiFeatureCard from "@/components/featureCard";
import FooterCard from "@/components/footercard"


export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isSearching, setIsSearching] = useState(false);


  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        setIsSearching(true);

        const res = await api.get<GetPostsResponse>("/api/post/getPost");
        setPosts(res.data.data.slice(0, 12));
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    };

    fetchAllPosts();
  }, []);

  return (
    <div>
      <div className=" h-screen bg-linear-to-t  from-emerald-300 to-white bg-no-repeat rounded-b-[40px]  pb-10">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex flex-col mt-30 space-y-6 ">

            <PlatformIntroCard />
            <AiFeatureCard />
          </div>


        </div>
      </div>


      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10">
          {posts.map((post) => (
            <Link key={post.id} href={`/post/${post.id}`}>
              <PostCard
                title={post.title}
                name={post.user?.name ?? "Unknown"}
                postType={post.postType}
                image={
                  post.images?.[0]?.url && post.images[0].url !== "#"
                    ? post.images[0].url
                    : "/img/1.jpg"
                }
              />
            </Link>
          ))}
        </div>

        {isSearching ? (
          <div className="mt-10 text-center text-gray-600">
            Post are Loading... please wait
          </div>
        ) : (
          <div>
          </div>
        )}



        <div className="w-full flex items-center justify-center my-10">
          <Link href={"/discover"}>
            <div className="max-w-xl text-2xl text-center bg-linear-to-t from-emerald-600 to-emerald-300 p-2 rounded-full text-white px-4 cursor-pointer font-mono"  >
              EXPLORE MORE
            </div>
          </Link>
        </div>


        {!isSearching && posts.length === 0 && (
          <div className="mt-10 text-center text-gray-600">
            No matching posts found.
          </div>
        )}
      </div>

      <FooterCard></FooterCard>
    </div >
  );
}
