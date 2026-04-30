"use client"

import { useRouter } from "next/navigation"
import api from "@/config/axios"
import axios from "axios"
import { useUserStore } from "@/store/useUserStore"
import { Upload } from "lucide-react";

export default function ProfileCard() {
  const { user, clearUser } = useUserStore()
  const router = useRouter()

  const isContributor = user?.userType?.toUpperCase() === "CONTRIBUTOR"

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout")
      clearUser()
      router.push("/")
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log(err.response?.data)
      }
    }
  }

  if (!user) return null;

  return (
    <div className="w-full max-w-4xl bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col gap-6">

      {/* Header */}
      <div className="flex justify-end items-center">
        <button
          onClick={handleLogout}
          className="px-4 py-1 bg-gray-500 text-white rounded-full hover:bg-red-600 cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-amber-800 text-white text-xl font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>

        <div>
          <h2 className="text-lg font-semibold">{user.name}</h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
      </div>




      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-gray-50 p-5 rounded-xl border">
          <p className="text-gray-600">Total Events</p>
          <h2 className="text-2xl font-bold text-blue-600">
            {user?.counts?.events ?? 0}
          </h2>
        </div>

        <div className="bg-gray-50 p-5 rounded-xl border">
          <p className="text-gray-600">Total Places</p>
          <h2 className="text-2xl font-bold text-green-600">
            {user?.counts?.places ?? 0}
          </h2>
        </div>

        <div className="bg-gray-50 p-5 rounded-xl border">
          <p className="text-gray-600">Total Services</p>
          <h2 className="text-2xl font-bold text-orange-600">
            {user?.counts?.services ?? 0}
          </h2>
        </div>

      </div>

      {/* Contributor Button */}
      {isContributor && (
        <div className="flex justify-center mt-5">
          <button
            onClick={() => router.push("/contribute")}
            className="flex items-center gap-2 px-6 py-2 bg-black text-white cursor-pointer rounded-full shadow-md hover:shadow-lg"
          >
            <Upload size={18} />
            Contribute
          </button>
        </div>
      )}


    </div>
  )
}


