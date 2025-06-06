import { FiX } from "react-icons/fi";
import { GoogleLogin } from "@react-oauth/google";
import AuthDivider from "../components/AuthDivider";
import useAuth from "../hooks/useAuth";

export default function AuthForm({
  type,
  loading,
  children,
  onClose,
  onSwitchType,
}) {
  const { handleGoogleLogin, error: authError } = useAuth();

  const authText = {
    login: {
      title: "Login to Workerr ",
      switchText: "Not a member?",
      switchAction: "Join Now",
    },
    signup: {
      title: "Sign up to Workerr",
      switchText: "Already a member?",
      switchAction: "Login Now",
    },
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center">
      <form
        className="bg-white p-8 rounded-lg shadow-lg relative w-96 max-w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
          disabled={loading}
        >
          <FiX className="text-xl text-gray-500" />
        </button>

        <h3 className="text-2xl font-semibold text-center mb-6">
          {authText[type].title}
        </h3>

        {authError?.detail && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded text-sm">
            {authError.detail}
          </div>
        )}

        <div className="flex flex-col gap-4 mb-4">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={(error) => {
              console.error("Google Login Failed:", error);
              if (error.error === "popup_closed_by_user") {
                // Handle user closing the popup
                return;
              }
              if (error.error === "access_denied") {
                // Handle user denying access
                return;
              }
              // Handle other errors
              setError({ detail: "Google login failed. Please try again." });
            }}
            useOneTap={false}
            flow="implicit"
            theme="filled_blue"
            text="continue_with"
          />
        </div>

        <AuthDivider />

        <div className="flex flex-col gap-4">{children}</div>

        {authError && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded text-sm">
            {authError.message}
          </div>
        )}

        <div className="mt-6 text-sm text-center">
          {authText[type].switchText}{" "}
          <button
            type="button"
            onClick={onSwitchType}
            className="text-[#1DBF73] cursor-pointer font-medium hover:underline"
            disabled={loading}
          >
            {authText[type].switchAction}
          </button>
        </div>
      </form>
    </div>
  );
}
