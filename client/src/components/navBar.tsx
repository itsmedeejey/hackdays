
"use client";

import Link from "next/link";
import Image from "next/image";
import { useUserStore } from "@/store/useUserStore";
import { useSearchParams } from "next/navigation";

export default function NavBar() {
  const searchParams = useSearchParams();
  const selectedType = searchParams.get("type")?.toUpperCase();

  const user = useUserStore((state) => state.user);
  const initial = user?.name?.trim().charAt(0).toUpperCase() || "U";
  const isContributor = user?.userType?.toUpperCase() === "CONTRIBUTOR";

  const itemClass = (type: "PLACE" | "EVENT" | "SERVICE") =>
    `p-2 rounded-xl cursor-pointer transition-transform duration-300 ease-in-out hover:scale-[1.08] ${selectedType === type
      ? "underline text-gray-900"
      : "hover:underline hover:text-gray-800"
    }`;

  return (
    <div className="px-10 mt-5  h-10 w-full rounded-2xl flex items-center justify-center">

      <div className="flex  w-full justify-start ">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={300} height={300} className="w-20 bg-blend-luminosity" />
        </Link>
      </div>

      <Link href={"/discover"}>
        <div className="bg-emerald-400 p-2 rounded-full text-white px-4 cursor-pointer"  >

          EXPLORE

        </div>

      </Link>

      <div className="flex w-full justify-end items-center gap-3">
        {user && !isContributor && (
          <Link href="/contributor-login">
            <div className="bg-green-500 p-2 rounded-xl text-white">
              BECOME A CONTRIBUTOR
            </div>
          </Link>
        )}

        {user ? (
          <Link href="/profile">
            <div className="bg-gray-200 w-10 h-10 flex items-center justify-center rounded-full">
              {initial}
            </div>
          </Link>
        ) : (
          <Link href="/contributor-login">
            <div className="bg-black text-white px-4 py-2 rounded-xl">
              BECOME A CONTRIBUTOR
            </div>
          </Link>
        )}
      </div>

    </div>
  );
}
