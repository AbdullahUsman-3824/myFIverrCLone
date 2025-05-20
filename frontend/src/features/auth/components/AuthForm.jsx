import { FiX } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { MdFacebook } from "react-icons/md";
import SocialAuthButton from "../components/SocialAuthButton";
import AuthDivider from "../components/AuthDivider";

export default function AuthForm({
  type,
  loading,
  errors,
  onClose,
  onSwitchType,
  emailInputRef,
  children,
}) {
  return (
    <div className="fixed top-0 left-0 z-[100] h-screen w-screen">
      <div className="fixed inset-0 backdrop-blur-md" onClick={onClose}></div>
      <div className="h-full w-full flex justify-center items-center">
        <form
          className="bg-white p-8 rounded-lg shadow-lg z-[101] relative w-96"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
            aria-label="Close"
            disabled={loading}
          >
            <FiX className="text-xl text-gray-500" />
          </button>

          <h3 className="text-2xl font-semibold text-center mb-6">
            {type === "login" ? "Login to Fiverr" : "Sign up to Fiverr"}
          </h3>

          <div className="flex flex-col gap-4 mb-4">
            <SocialAuthButton
              icon={MdFacebook}
              text="Continue with Facebook"
              bgColor="bg-blue-500"
              textColor="text-white"
            />
            <SocialAuthButton
              icon={FcGoogle}
              text="Continue with Google"
              border="border border-slate-300"
            />
          </div>

          <AuthDivider />

          <div className="flex flex-col gap-4">{children}</div>

          <div className="mt-6 text-sm text-center">
            {type === "login" ? (
              <>
                Not a member?{" "}
                <button
                  type="button"
                  onClick={onSwitchType}
                  className="text-[#1DBF73] cursor-pointer font-medium"
                  disabled={loading}
                >
                  Join Now
                </button>
              </>
            ) : (
              <>
                Already a member?{" "}
                <button
                  type="button"
                  onClick={onSwitchType}
                  className="text-[#1DBF73] cursor-pointer font-medium"
                  disabled={loading}
                >
                  Login Now
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
