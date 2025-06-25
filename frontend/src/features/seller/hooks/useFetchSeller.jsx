import api from "../../../utils/apiClient";
import {
  SELLER_DETAIL_URL,
  PUBLIC_SELLER_DETAIL_BY_ID_URL,
} from "../../../utils/constants";
import { useState, useCallback } from "react";
import { toast } from "react-toastify";

const useFetchSeller = () => {
  const [sellerInfo, setSellerInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSeller = useCallback(async (sellerId = null) => {
    setLoading(true);
    try {
      const url = sellerId
        ? `${PUBLIC_SELLER_DETAIL_BY_ID_URL}${sellerId}/`
        : SELLER_DETAIL_URL;

      const response = await api.get(url);
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
