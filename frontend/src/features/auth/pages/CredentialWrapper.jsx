import FiverrLogo from "../../../components/shared/FiverrLogo";
import { Outlet } from "react-router-dom";

const CredentialWrapper = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="flex justify-center text-3xl font-bold text-gray-900">
            <FiverrLogo fillColor={"#404145"} />
          </h1>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default CredentialWrapper;
