import { useState, useEffect } from "react";
import { axiosInstance as axios } from "../features/auth/api";

const useFetchUser = (shouldFetch = false) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!shouldFetch) return;

      setLoading(true);
      try {
        const {
          data: { user },
        } = await axios.get("/auth/user/", {
          withCredentials: true,
        });
        setUser(user);
      } catch (err) {
        setError(err.response?.data || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [shouldFetch]);

  return { user, loading, error };
};

export default useFetchUser;
