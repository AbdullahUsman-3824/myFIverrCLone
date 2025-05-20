import { useState } from "react";
import axios from "axios";
import { SIGNUP_ROUTE } from "../../../utils/constants";

export default function SignupForm({
  loading,
  errors,
  setErrors,
  setLoading,
  clearAuthCookies,
  closeModal,
  navigate,
}) {
  const [values, setValues] = useState({
    email: "",
    password1: "",
    password2: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ general: "" });

    // Validation logic...

    try {
      setLoading(true);
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
      // Error handling...
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
          onChange={handleChange}
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
          onChange={handleChange}
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
          onChange={handleChange}
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
        {loading ? <Spinner /> : "Continue"}
      </button>
    </>
  );
}
