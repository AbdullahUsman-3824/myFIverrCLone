import { useState } from "react";
import axios from "axios";
import { LOGIN_ROUTE } from "../../../utils/constants";
import Spinner from "../../../components/common/Spinner";

const useLoginForm = (initialState) => {
  const [values, setValues] = useState(initialState);

  const handleChange = (e, setErrors) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return { values, handleChange, setValues };
};

export default function LoginForm({
  loading,
  errors,
  setErrors,
  setLoading,
  setCookie,
  clearAuthCookies,
  dispatch,
  closeModal,
  navigate,
}) {
  const { values, handleChange } = useLoginForm({
    login_identifier: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = {};
    if (!values.login_identifier)
      newErrors.login_identifier = "This field is required";
    if (!values.password) newErrors.password = "Password is required";
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
        LOGIN_ROUTE,
        {
          login_identifier: values.login_identifier,
          password: values.password,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (data.access) {
        setCookie("jwt", data.access, {
          path: "/",
          secure: process.env.NODE_ENV !== "development",
          sameSite: "strict",
        });
      }

      dispatch({ type: reducerCases.SET_USER, userInfo: data.user });
      closeModal();
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setErrors({
        general:
          err.response?.data?.non_field_errors ||
          "Login failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <input
          type="text"
          name="login_identifier"
          placeholder="Email or Username"
          value={values.login_identifier}
          onChange={(e) => handleChange(e, setErrors)}
          className={`border ${
            errors.login_identifier ? "border-red-500" : "border-slate-300"
          } p-3 rounded w-full`}
          disabled={loading}
        />
        {errors.login_identifier && (
          <span className="text-red-500 text-xs mt-1">
            {errors.login_identifier}
          </span>
        )}
      </div>

      <div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={values.password}
          onChange={(e) => handleChange(e, setErrors)}
          className={`border ${
            errors.password ? "border-red-500" : "border-slate-300"
          } p-3 rounded w-full`}
          disabled={loading}
        />
        {errors.password && (
          <span className="text-red-500 text-xs mt-1">{errors.password}</span>
        )}
        <div className="text-right mt-1">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Forgot Password?
          </button>
        </div>
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
