// useFetchSeller.js
import api from "../../../utils/apiClient";
import { SELLER_DETAIL_URL } from "../../../utils/constants";
import { useStateProvider } from "../../../context/StateContext";
import { setSellerInfo } from "../../../context/StateReducer";
import { useState, useCallback } from "react";
import { toast } from "react-toastify";

const useFetchSeller = () => {
  const [{ sellerInfo }, dispatch] = useStateProvider();
  const [loading, setLoading] = useState(false);

  // Function to fetch seller details only if sellerInfo is not already available
  const fetchSeller = useCallback(async () => {
    if (sellerInfo) return;

    setLoading(true);
    try {
      const response = await api.get(SELLER_DETAIL_URL);
      dispatch(setSellerInfo(response.data));
    } catch (err) {
      toast.error("Failed to fetch seller details. Please try again later.");
      console.error("Error fetching seller details:", err);
    } finally {
      setLoading(false);
    }
  }, [dispatch, sellerInfo]);

  return { loading, fetchSeller };
};

export default useFetchSeller;
