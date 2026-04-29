"use client";

import { Sparkles, Map, Calendar, Store } from "lucide-react";
import Link from "next/link";

export default function PlatformIntroCard() {
  return (
    <div className="w-full flex justify-center px-4 mt-8">
      <div className="w-full max-w-5xl rounded-3xl bg-white/70 backdrop-blur-md shadow-lg border border-white/30 p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center">

        {/* LEFT */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3 text-green-700">
            <Sparkles size={18} />
            <span className="text-sm font-medium">GreenVoyage</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 leading-snug">
            Discover North East, your way
          </h2>

          <p className="text-gray-600 mt-3 text-sm md:text-base max-w-lg">
            Explore places, cultural events, and essential services across North East.
            Get personalized recommendations based on your interests and uncover
            hidden gems effortlessly.
          </p>

          <div className="flex gap-3 mt-6">
            <Link href={"/discover"} >

              <button className="cursor-pointer px-5 py-2 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition">
                Explore Now
              </button>

            </Link>
            <button className="px-5 py-2 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition">
              Learn More
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          <Feature
            icon={<Map size={18} />}
            title="Places"
            desc="Curated destinations & hidden gems"
          />
          <Feature
            icon={<Calendar size={18} />}
            title="Events"
            desc="Festivals, culture & experiences"
          />
          <Feature
            icon={<Store size={18} />}
            title="Services"
            desc="Local sustainable services "
          />
        </div>
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl bg-white shadow-sm border p-4 hover:shadow-md transition">
      <div className="flex items-center gap-2 text-green-600 mb-2">
        {icon}
        <span className="font-medium text-sm">{title}</span>
      </div>
      <p className="text-xs text-gray-600">{desc}</p>
    </div>
  );
}
