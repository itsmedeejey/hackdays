"use client";

import PostCard from "@/components/porstCard";
import { useEffect, useState } from "react";
import api from "@/config/axios";
import { GetPostsResponse, Post } from "@/types/getAllPost.type";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PlatformIntroCard from "@/components/introCard";
import AiFeatureCard from "@/components/featureCard";
import FooterCard from "@/components/footercard"

type SearchPostsResponse = {
  success: boolean;
  data: Post[];
};

type PostTypeFilter = "PLACE" | "EVENT" | "SERVICE" | null;

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const searchParams = useSearchParams();

  const selectedTypeParam = searchParams.get("type")?.toUpperCase();
  const selectedType: PostTypeFilter =
    selectedTypeParam === "PLACE" ||
      selectedTypeParam === "EVENT" ||
      selectedTypeParam === "SERVICE"
      ? selectedTypeParam
      : null;

  //
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
  useEffect(() => {
    fetchAllPosts();
  }, []);

  //fetch called by search bar
  const searchPosts = async () => {
    try {
      setIsSearching(true);

      const res = await api.get<SearchPostsResponse>("/api/search", {
        params: {
          ...(query ? { query: query.trim() } : {}),
          ...(selectedType ? { postType: selectedType } : {}),
          page: 1,
          limit: 100,
        },
      });

      setPosts(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };
  return (
    <div>
      <div className=" h-screen bg-linear-to-t  from-emerald-300 to-white bg-no-repeat rounded-b-[40px]  pb-10">
        <div className="max-w-6xl mx-auto px-4 md:px-8">

          {/* {/* Search */}
          {/* <div className="mt-5 flex justify-center"> */}
          {/*   <SearchBar */}
          {/*     query={query} */}
          {/*     onQueryChange={(value) => setQuery(value)} */}
          {/*     onSearch={() => searchPosts()} */}
          {/*     isSearching={isSearching} */}
          {/*   /> */}
          {/* </div> */}

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

        <div className="w-full flex items-center justify-center my-10">
          <Link href={"/discover"}>
            <div className="max-w-xl text-2xl text-center bg-linear-to-t from-emerald-600 to-emerald-300 p-2 rounded-full text-white px-4 cursor-pointer font-mono"  >
              EXPLORE MORE
            </div>
          </Link>
        </div>


        {/* Empty State */}
        {!isSearching && posts.length === 0 && (
          <div className="mt-10 text-center text-gray-600">
            No matching posts found.
          </div>
        )}
      </div>

      <FooterCard></FooterCard>
    </div>
  );
}
