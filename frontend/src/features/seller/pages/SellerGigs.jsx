import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFetchMyGigs from "../hooks/useFetchMyGigs";
import { FiEdit2, FiPlus, FiArrowLeft } from "react-icons/fi";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteGigButton from "../components/DeleteGigButton";

const SellerGigs = () => {
  const navigate = useNavigate();
  const { fetchMyGigs, myGigs, loading } = useFetchMyGigs();

  useEffect(() => {
    fetchMyGigs();
  }, [fetchMyGigs]);

  const handleCreateGig = () => {
    navigate("/seller/gigs/create");
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] pt-28 px-4 md:px-32">
      {/* Go Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-6 flex items-center gap-2 text-[#404145] hover:text-black transition font-medium"
      >
        <FiArrowLeft />
        <span>Go Back</span>  
      </button>

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-[#222]">Your Gigs</h3>
        <button
          onClick={handleCreateGig}
          className="flex items-center gap-2 px-4 py-2 bg-[#404145] text-white rounded hover:bg-black transition"
        >
          <FiPlus />
          Create New Gig
        </button>
      </div>

      {myGigs.length === 0 ? (
        <div className="flex items-center justify-center py-20 px-6 bg-white rounded-2xl shadow-md">
          <div className="text-center max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              No Gigs Yet
            </h2>
            <p className="text-gray-500 mb-6">
              You haven’t created any gigs. Start by creating your first one.
            </p>
            <button
              onClick={handleCreateGig}
              className="px-5 py-2.5 bg-[#404145] hover:bg-black text-white font-medium rounded-md transition"
            >
              Create Your First Gig
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs uppercase bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Delivery</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myGigs.map((gig) => (
                  <tr
                    key={gig.id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-[#404145] whitespace-nowrap">
                      <a
                        href={`/gig/${gig.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {gig.title}
                      </a>
                    </td>
                    <td className="px-6 py-4">{gig.category_name}</td>
                    <td className="px-6 py-4">
                      {gig.packages[0]?.price
                        ? `$${gig.packages[0].price}`
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      {gig.packages[0]?.delivery_days
                        ? `${gig.packages[0].delivery_days} days`
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          gig.status === "active"
                            ? "bg-green-100 text-green-700"
                            : gig.status === "paused"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {gig.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() =>
                            navigate(`/seller/gigs/${gig.id}/edit`)
                          }
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <DeleteGigButton
                          gigId={gig.id}
                          onDeleted={fetchMyGigs}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerGigs;
