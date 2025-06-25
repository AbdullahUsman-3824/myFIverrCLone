import { useState, useEffect, useCallback } from "react";
import api from "../../../utils/apiClient";
import { BECOME_SELLER_URL, SELLER_SETUP_URL } from "../../../utils/constants";
import { useStateProvider } from "../../../context/StateContext";
import { setUser } from "../../../context/StateReducer";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useSellerOnboardingRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [{ userInfo }, dispatch] = useStateProvider();
  const navigate = useNavigate();

  const initiateSellerAccount = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.post(BECOME_SELLER_URL);
      dispatch(setUser(response.data.user));
      toast.success("Seller account initiated successfully!");
    } catch (err) {
      console.error("Become seller failed:", err);
      toast.error(err.message || "Failed to initiate seller account.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userInfo.is_seller && !isLoading) {
      initiateSellerAccount();
    }
  }, []);

  const handleSubmit = useCallback(
    async (formData) => {
      setIsLoading(true);

      try {
        const formDataToSend = JSON.stringify(formData);
        await api.put(SELLER_SETUP_URL, formDataToSend);
        toast.success("Seller profile setup completed!");
        navigate("/dashboard");
      } catch (err) {
        console.error("Onboarding failed:", err);
        toast.error(err.response?.data?.message || "Onboarding failed.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [navigate]
  );

  return { isLoading, handleSubmit };
};

export default useSellerOnboardingRequest;
