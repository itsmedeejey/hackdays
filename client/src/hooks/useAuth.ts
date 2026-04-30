import { useEffect } from "react";
import api from "@/config/axios";
import { useUserStore } from "@/store/useUserStore";

export const useAuth = () => {
  const { user, setUser, isLoading, setLoading } = useUserStore();

  useEffect(() => {
    if (user || isLoading) return;

    const fetchMe = async () => {
      try {
        setLoading(true);

        const res = await api.get("/api/auth/getAuthMe", {
        });

        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();

  }, [user, setUser, setLoading]);
};
