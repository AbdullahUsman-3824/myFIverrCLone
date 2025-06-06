import { useState } from "react";

const useSellerForm = () => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    profile_title: "",
    bio: "",
    location: "",
    portfolio_link: "",
    educations: [],
    skills: [],
    languages: [],
    portfolio_items: [],
  });

  const validateFormData = (formData) => {
    const errors = {};
    if (step == 1) {
      if (!formData.profile_title) {
        errors.profile_title = "Profile title is required.";
      }
      if (!formData.bio) {
        errors.bio = "Bio is required.";
      }
    }
    if (step == 3) {
      if (!formData.skills.length) {
        errors.skills = "At least one skill is required.";
      }
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors({});
  };

  const handlePortfolioUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      portfolio_items: [...prev.portfolio_items, ...files],
    }));
  };

  const handleNext = () => {
    const errors = validateFormData(formData);
    console.log(errors);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return {
    step,
    formData,
    setFormData,
    handleChange,
    handlePortfolioUpload,
    handleNext,
    handleBack,
    errors,
    setErrors,
  };
};

export default useSellerForm;
