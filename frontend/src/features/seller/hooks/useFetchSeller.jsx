// useFetchSeller.js
import api from "../../../utils/apiClient";
import { SELLER_DETAIL_URL } from "../../../utils/constants";
import { useState, useCallback } from "react";
import { toast } from "react-toastify";

const useFetchSeller = () => {
  const [sellerInfo, setSellerInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to fetch seller details only if sellerInfo is not already available
  const fetchSeller = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(SELLER_DETAIL_URL);
      setSellerInfo(response.data);
    } catch (err) {
      toast.error("Failed to fetch seller details. Please try again later.");
      console.error("Error fetching seller details:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, fetchSeller, sellerInfo };
};

export default useFetchSeller;
