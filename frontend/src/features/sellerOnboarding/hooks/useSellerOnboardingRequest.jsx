import { useState, useEffect } from "react";
import api from "../../../utils/apiClient";
import { setUser } from "../../../context/StateReducer";
import { useStateProvider } from "../../../context/StateContext";
import { useNavigate } from "react-router-dom";

const useSellerOnboardingRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [{userInfo}, dispatch] = useStateProvider();
  const navigate = useNavigate();

  useEffect(() => {
    const initiateSellerAccount = async () => {
      try {
        setIsLoading(true);
        await api.post("/accounts/become-seller/");
      } catch (err) {
        console.error("Become seller failed:", err);
        setError(err.response?.data || { message: "An error occurred" });
      } finally {
        setIsLoading(false);
      }
    };
    if (!userInfo.is_seller) initiateSellerAccount();
  }, []);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const formDataToSend = JSON.stringify(formData);

      const profileRes = await api.put(
        "/accounts/seller/profile/setup/",
        formDataToSend
      );

      navigate("/seller");
    } catch (err) {
      console.error("Onboarding failed:", err);
      setError(err.response?.data || { message: "An error occurred" });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, handleSubmit };
};

export default useSellerOnboardingRequest;
