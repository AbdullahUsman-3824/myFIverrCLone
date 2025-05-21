import { FiX } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { MdFacebook } from "react-icons/md";
import SocialAuthButton from "../components/SocialAuthButton";
import AuthDivider from "../components/AuthDivider";

export default function AuthForm({
  type,
  loading,
  children,
  onClose,
  onSwitchType,
  emailInputRef,
}) {
  const authText = {
    login: {
      title: "Login to Fiverr",
      switchText: "Not a member?",
      switchAction: "Join Now",
    },
    signup: {
      title: "Sign up to Fiverr",
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

        <div className="flex flex-col gap-4 mb-4">
          <SocialAuthButton
            icon={MdFacebook}
            text={`Continue with Facebook`}
            bgColor="bg-blue-500"
            textColor="text-white"
          />
          <SocialAuthButton
            icon={FcGoogle}
            text={`Continue with Google`}
            border="border border-slate-300"
          />
        </div>

        <AuthDivider />

        <div className="flex flex-col gap-4">{children}</div>

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
