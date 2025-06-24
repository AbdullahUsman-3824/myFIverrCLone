//seller/hooks/useFetchMyGigs.jsx
import { useCallback, useEffect, useState } from "react";
import api from "../../../utils/apiClient";
import { GET_MY_GIGS_ROUTE } from "../../../utils/constants";

const useFetchMyGigs = () => {
  const [myGigs, setMyGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyGigs = useCallback(async () => {
    try {
      const response = await api.get(GET_MY_GIGS_ROUTE);
      setMyGigs(response.data);
    } catch (err) {
      setError(err?.response?.data || "Failed to fetch gigs");
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchMyGigs, myGigs, loading, error };
};

export default useFetchMyGigs;
