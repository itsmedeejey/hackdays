"use client";

import Image from "next/image";

import { useEffect, useState } from "react";

type PostCardType = {
  title: string;
  image: string;
  name: string;
  postType: "PLACE" | "EVENT" | "SERVICE";
  eventDate: string | undefined;
};

export default function PostCard({
  title,
  image,
  name,
  postType,
  eventDate,
}: PostCardType) {

  const [isUpcoming, setIsUpcoming] = useState(false);



  useEffect(() => {
    if (postType !== "EVENT" || !eventDate) {
      return;
    }
    const endDate = new Date(eventDate).getTime();
    const now = Date.now();
    setIsUpcoming(endDate > now);

  }, [postType, eventDate]);

  return (
    <div className="w-full aspect-4/5 rounded-2xl overflow-hidden  text-white relative cursor-pointer transition-transform duration-300 ease-in-out hover:scale-[1.04] flex flex-col
bg-linear-to-t from-emerald-600 to-emerald-300 
      ">



      {isUpcoming ? (
        <div className="absolute top-3 left-3 z-10 bg-black/50 backdrop-blur px-3 py-1 rounded-md text-sm font-medium">
          Upcoming Event
        </div>
      ) : (
        <div className="absolute top-3 left-3 z-10 bg-black/50 backdrop-blur px-3 py-1 rounded-md text-sm font-medium">
          {postType}
        </div>

      )}



      {/* Image */}
      <div className="relative w-full h-[90%]">
        <Image
          fill
          alt={title}
          src={image}
          className="object-cover rounded-b-lg"
        />
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col justify-between h-[30%]">
        <div className="font-sans text-lg line-clamp-2">
          {title}
        </div>

        <div className="flex flex-row gap-2 items-center">
          <div className="bg-white h-8 w-8 flex items-center justify-center rounded-full text-black font-semibold">
            {name[0]}
          </div>
          <div className="text-sm opacity-80 truncate">
            {name}
          </div>

        </div>
      </div>

    </div>
  );
}
