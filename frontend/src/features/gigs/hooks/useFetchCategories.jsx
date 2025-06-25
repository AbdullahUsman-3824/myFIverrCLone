// useFetchCategories.js
import api from "../../../utils/apiClient";
import {
  GET_ALL_CATEGORIES_URL,
  GET_ALL_SUBCATEGORIES_URL,
} from "../../../utils/constants";
import { useState, useCallback } from "react";
import { toast } from "react-toastify";

const useFetchCategories = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(GET_ALL_CATEGORIES_URL);
      setCategories(response.data.results);
    } catch (err) {
      toast.error("Failed to fetch categories. Please try again later.");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSubCategories = useCallback(async (categoryID) => {
    setLoading(true);
    try {
      const response = await api.get(GET_ALL_SUBCATEGORIES_URL, {
        params: { category: categoryID },
      });
      setSubcategories(response.data);
    } catch (err) {
      toast.error("Failed to fetch subcategories. Please try again later.");
      console.error("Error fetching subcategories:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    fetchCategories,
    fetchSubCategories,
    categories,
    subcategories,
  };
};

export default useFetchCategories;
