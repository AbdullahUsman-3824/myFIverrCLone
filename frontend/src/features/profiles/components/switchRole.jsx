export default function SwitchRole() {
  const handleSwitchToSeller = async () => {
    setIsSwitchingToSeller(true);
    try {
      const { data } = await axios.post(
        `${HOST}/api/users/switch-to-seller`,
        {},
        {
          withCredentials: true,
        }
      );

      dispatch({
        type: "SET_USER",
        userInfo: data.user,
      });

      navigate("/seller");
    } catch (error) {
      console.error("Failed to switch to seller:", error);
    } finally {
      setIsSwitchingToSeller(false);
    }
  };
  return (
    <>
      {/* Switch to Seller Section */}
      {!state.userInfo?.isSeller && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Become a Seller
          </h3>
          <p className="text-gray-600 mb-4">
            Start selling your services and earn money by becoming a seller on
            our platform.
          </p>
          <button
            onClick={handleSwitchToSeller}
            disabled={isSwitchingToSeller}
            className={`w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
              isSwitchingToSeller ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            <FiBriefcase className="mr-2" />
            {isSwitchingToSeller ? "Switching..." : "Switch to Seller"}
          </button>
        </div>
      )}
      {/* Switch to Seller Section */}
      {!state.userInfo?.isSeller && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Become a Seller
          </h3>
          <p className="text-gray-600 mb-4">
            Start selling your services and earn money by becoming a seller on
            our platform.
          </p>
          <button
            onClick={handleSwitchToSeller}
            disabled={isSwitchingToSeller}
            className={`w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
              isSwitchingToSeller ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            <FiBriefcase className="mr-2" />
            {isSwitchingToSeller ? "Switching..." : "Switch to Seller"}
          </button>
        </div>
      )}

      {/* Seller Dashboard Link */}
      {state.userInfo?.isSeller && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Seller Dashboard
          </h3>
          <p className="text-gray-600 mb-4">
            Access your seller dashboard to manage your gigs, orders, and
            earnings.
          </p>
          <button
            onClick={() => navigate("/seller")}
            className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiBriefcase className="mr-2" />
            Go to Seller Dashboard
          </button>
        </div>
      )}
    </>
  );
}
