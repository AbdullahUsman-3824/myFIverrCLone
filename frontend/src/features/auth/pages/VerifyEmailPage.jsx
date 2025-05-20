import EmailVerification from "../components/EmailVerification";

const VerifyEmailPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Email Verification</h1>
          <p className="mt-2 text-sm text-gray-600">
            Please verify your email address to continue
          </p>
        </div>
        <EmailVerification />
      </div>
    </div>
  );
};

export default VerifyEmailPage;