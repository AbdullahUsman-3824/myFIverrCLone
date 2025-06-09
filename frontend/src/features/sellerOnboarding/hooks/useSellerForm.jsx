import { useState, useCallback } from "react";

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

  const validateFormData = useCallback(
    (data) => {
      const errors = {};

      if (step === 1) {
        if (!data.profile_title?.trim()) {
          errors.profile_title = "Profile title is required.";
        }
        if (!data.bio?.trim()) {
          errors.bio = "Bio is required.";
        }
        if (data.bio?.trim().length < 50) {
          errors.bio = "Bio must be at least 50 characters.";
        }
        if (data.portfolio_link?.trim()) {
          const urlPattern =
            /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&=]*)$/;
          if (!urlPattern.test(data.portfolio_link.trim())) {
            errors.portfolio_link = "Portfolio link must be a valid URL.";
          }
        }
      }

      if (step === 3) {
        if (!Array.isArray(data.skills) || !data.skills.length) {
          errors.skills = "At least one skill is required.";
        }
      }

      return errors;
    },
    [step]
  );

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  const handleNext = useCallback(() => {
    const validationErrors = validateFormData(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (step < 4) {
      setStep((prevStep) => prevStep + 1);
    }
  }, [formData, step, validateFormData]);

  const handleBack = useCallback(() => {
    if (step > 1) {
      setStep((prevStep) => prevStep - 1);
    }
  }, [step]);

  return {
    step,
    formData,
    setFormData,
    handleInputChange,
    handleNext,
    handleBack,
    errors,
    setErrors,
  };
};

export default useSellerForm;
