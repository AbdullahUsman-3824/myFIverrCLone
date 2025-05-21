import { useState } from "react";
import axios from "axios";
import { SIGNUP_ROUTE } from "../../../utils/constants";
import Spinner from "../../../components/common/Spinner";

const useSignupForm = (initialState) => {
  const [values, setValues] = useState(initialState);

  const handleChange = (e, setErrors) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return { values, handleChange, setValues };
};

export default function SignupForm({
  loading,
  errors,
  setErrors,
  setLoading,
  clearAuthCookies,
  closeModal,
  navigate,
}) {
  const { values, handleChange } = useSignupForm({
    email: "",
    password1: "",
    password2: "",
  });

  const validateForm = () => {
    const newErrors = {};
    if (!values.email) newErrors.email = "Email is required";
    if (!values.password1) newErrors.password1 = "Password is required";
    if (!values.password2) newErrors.password2 = "Please confirm password";
    if (values.password1 !== values.password2) {
      newErrors.password2 = "Passwords don't match";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      return setErrors(formErrors);
    }

    try {
      setLoading(true);
      clearAuthCookies();

      const { data } = await axios.post(
        SIGNUP_ROUTE,
        {
          email: values.email,
          password1: values.password1,
          password2: values.password2,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      closeModal();
      navigate("/verify-email", { state: { email: values.email } });
    } catch (err) {
      setErrors({
        general:
          err.response?.data?.message || "Signup failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={values.email}
          onChange={(e) => handleChange(e, setErrors)}
          className={`border ${
            errors.email ? "border-red-500" : "border-slate-300"
          } p-3 rounded w-full`}
          disabled={loading}
        />
        {errors.email && (
          <span className="text-red-500 text-xs mt-1">{errors.email}</span>
        )}
      </div>
      <div>
        <input
          type="password"
          name="password1"
          placeholder="Password"
          value={values.password1}
          onChange={(e) => handleChange(e, setErrors)}
          className={`border ${
            errors.password1 ? "border-red-500" : "border-slate-300"
          } p-3 rounded w-full`}
          disabled={loading}
        />
        {errors.password1 && (
          <span className="text-red-500 text-xs mt-1">{errors.password1}</span>
        )}
      </div>
      <div>
        <input
          type="password"
          name="password2"
          placeholder="Confirm Password"
          value={values.password2}
          onChange={(e) => handleChange(e, setErrors)}
          className={`border ${
            errors.password2 ? "border-red-500" : "border-slate-300"
          } p-3 rounded w-full`}
          disabled={loading}
        />
        {errors.password2 && (
          <span className="text-red-500 text-xs mt-1">{errors.password2}</span>
        )}
      </div>
      {errors.general && (
        <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded">
          {errors.general}
        </div>
      )}
      <button
        type="submit"
        className="bg-[#1DBF73] text-white p-3 font-semibold rounded disabled:opacity-50"
        disabled={loading}
        onClick={handleSubmit}
      >
       {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner /> Processing...
          </span>
        ) : (
          "Continue" 
        )}
      </button>
    </>
  );
}
