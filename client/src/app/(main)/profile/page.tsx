"use client";

import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProfileCard from "@/components/ProfileCard";
import api from "@/config/axios";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, setUser, clearUser } = useUserStore();

  useEffect(() => {
    const fetchUser = async () => {
      if (user) return;

      try {
        const res = await api.get("/api/auth/getme");
        setUser(res.data);
      } catch (err) {
        clearUser();
        router.replace("/");
      }
    };

    fetchUser();
  }, []);

  if (isLoading || !user) return null;

  return (
    <div className="h-full flex justify-center mt-20">
      <ProfileCard />
    </div>
  );
}
