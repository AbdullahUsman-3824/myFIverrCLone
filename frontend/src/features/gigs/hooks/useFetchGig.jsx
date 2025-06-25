// useFetchGig.js
import api from "../../../utils/apiClient";
import { GIG_ROUTE } from "../../../utils/constants";
import { useState, useCallback } from "react";
import { toast } from "react-toastify";

const useFetchGig = () => {
  const [loading, setLoading] = useState(false);
  const [gig, setGig] = useState(null); // Initialize as null

  const fetchGig = useCallback(async (gigId) => {
    if (!gigId) {
      toast.error("Gig ID is required to fetch gig details.");
      return;
    }
    setLoading(true);
    try {
      const response = await api.get(`${GIG_ROUTE}${gigId}/`);
      setGig(response.data);
    } catch (err) {
      toast.error("Failed to fetch gig. Please try again later.");
      console.error("Error fetching gig:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    fetchGig,
    gig,
    setGig,
  };
};

export default useFetchGig;
