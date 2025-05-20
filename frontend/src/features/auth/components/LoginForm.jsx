import { useState } from "react";
import axios from "axios";
import { LOGIN_ROUTE } from "../../../utils/constants";
import Spinner from "../../../components/common/Spinner";

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
  const [values, setValues] = useState({
    login_identifier: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ general: "" });

    if (!values.login_identifier || !values.password) {
      return setErrors({
        login_identifier: !values.login_identifier
          ? "This field is required."
          : "",
        password: !values.password ? "Password is required." : "",
      });
    }

    try {
      setLoading(true);
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
      // Error handling...
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
          onChange={handleChange}
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
          onChange={handleChange}
          className={`border ${
            errors.password ? "border-red-500" : "border-slate-300"
          } p-3 rounded w-full`}
          disabled={loading}
        />
        {errors.password && (
          <span className="text-red-500 text-xs mt-1">{errors.password}</span>
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
