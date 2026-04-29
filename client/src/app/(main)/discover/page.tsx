"use client";

import PostCard from "@/components/porstCard";
import { useEffect, useState } from "react";
import api from "@/config/axios";
import { GetPostsResponse, Post } from "@/types/getAllPost.type";
import SearchBar from "@/components/searchBar";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Personalize from "@/components/personalizeButton";

type SearchPostsResponse = {
  success: boolean;
  data: Post[];
};

type PostTypeFilter = "PLACE" | "EVENT" | "SERVICE" | null;

export default function Discover() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeType, setActiveType] = useState<PostTypeFilter>(null);


  const searchParams = useSearchParams();

  const selectedTypeParam = searchParams.get("type")?.toUpperCase();
  const selectedType: PostTypeFilter =
    selectedTypeParam === "PLACE" ||
      selectedTypeParam === "EVENT" ||
      selectedTypeParam === "SERVICE"
      ? selectedTypeParam
      : null;

  // 🔹 Fetch all posts (only once)
  const fetchAllPosts = async () => {
    try {
      setIsSearching(true);

      const res = await api.get<GetPostsResponse>("/api/post/getPost");

      setAllPosts(res.data.data);
      setPosts(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  // 🔹 Search (ONLY when triggered from SearchBar)
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

  const filterByType = (type: PostTypeFilter) => {
    setActiveType(type);

    if (!type) {
      setPosts(allPosts);
      return;
    }

    const filtered = allPosts.filter((post) => post.postType === type);
    setPosts(filtered);
  };

  return (
    <div>
      <div className="">
        <div className="max-w-6xl mx-auto px-4 md:px-8">

          {/* Search */}
          <div className="mt-5 flex justify-center">
            <SearchBar
              query={query}
              onQueryChange={(value) => setQuery(value)}
              onSearch={searchPosts}
              isSearching={isSearching}
            />
          </div>

          {/* Personalize */}
          <div className="flex items-center justify-center mt-5">
            <Personalize />
          </div>

          <div className="flex justify-center gap-3 mt-15 flex-wrap">

            <button
              onClick={() => filterByType(null)}
              className="px-4 py-1 rounded-xl text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              All
            </button>
            {["PLACE", "EVENT", "SERVICE"].map((type) => (
              <button
                key={type}
                onClick={() => filterByType(type as PostTypeFilter)}
                className={`px-4 py-1 rounded-xl text-sm font-medium border transition
                  ${activeType === type
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {type}
              </button>
            ))}

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
            <div className="mt-10 justify-center items-center text-center text-gray-600">
              Posts are loading.. Please Wait!
            </div>
          ) : (
            <div>
            </div>
          )}

          {!isSearching && posts.length === 0 && (
            <div className="mt-10 text-center text-gray-600">
              No matching posts found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
