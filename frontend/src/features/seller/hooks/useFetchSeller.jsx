//useFetchSeller.jsx
import api from "../../../utils/apiClient";
import { SELLER_DETAIL_URL } from "../../../utils/constants";
import { useStateProvider } from "../../../context/StateContext";
import { setSellerInfo } from "../../../context/StateReducer";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const useFetchSeller = () => {
  const [{ sellerInfo }, dispatch] = useStateProvider();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeller = async () => {
      setLoading(true);
      try {
        const response = await api.get(SELLER_DETAIL_URL);
        dispatch(setSellerInfo(response.data));
      } catch (err) {
        toast.error("Failed to fetch seller details");
        console.error("Error fetching seller details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeller();
  }, [dispatch]);

  return { sellerInfo, loading };
};

export default useFetchSeller;
