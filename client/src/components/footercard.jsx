"use client";

import Link from "next/link";

export default function FooterCard() {
  return (
    <div className="mt-32 px-4 md:px-8">
      <div className="w-full rounded-4xl bg-linear-to-br from-emerald-600 to-emerald-400 text-white p-10 shadow-xl">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-semibold">GreenVoyage</h2>
            <p className="mt-3 text-sm text-emerald-100 leading-relaxed">
              Discover places, events, and services across North East India.
              Personalized, sustainable, and powered by AI.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-2">
            <h3 className="font-medium text-lg">Explore</h3>
            <Link href="/discover" className="text-emerald-100 hover:text-white transition">
              Discover
            </Link>
            <Link href="/about" className="text-emerald-100 hover:text-white transition">
              About
            </Link>
            <Link href="/contact" className="text-emerald-100 hover:text-white transition">
              Contact
            </Link>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3">
            <h3 className="font-medium text-lg">Get Started</h3>
            <p className="text-sm text-emerald-100">
              Join as a contributor or explore personalized recommendations.
            </p>

            <div className="flex gap-3 mt-2">
              <Link
                href="/contribute"
                className="px-4 py-2 bg-white text-emerald-700 rounded-xl text-sm font-medium hover:bg-gray-100 transition"
              >
                Contribute
              </Link>

              <Link
                href="/discover"
                className="px-4 py-2 border border-white rounded-xl text-sm font-medium hover:bg-white hover:text-emerald-700 transition"
              >
                Explore
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-emerald-300/40 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-emerald-100">

          <p>© {new Date().getFullYear()} GreenVoyage. All rights reserved.</p>

          <div className="flex gap-4 mt-3 md:mt-0">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
