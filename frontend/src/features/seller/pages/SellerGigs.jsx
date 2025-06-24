import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/apiClient";
import { GIG_ROUTE } from "../../../utils/constants";
import useFetchMyGigs from "../hooks/useFetchMyGigs";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import Spinner from "../../../components/common/Spinner";
import ConfirmModal from "../../../components/common/ConfirmModal";
import DeleteGigButton from "../components/DeleteGigButton";

const SellerGigs = () => {
  const navigate = useNavigate();
  const { fetchMyGigs, myGigs, loading, error } = useFetchMyGigs();

  useEffect(() => {
    fetchMyGigs();
  }, [fetchMyGigs]);

  const handleCreateGig = () => {
    navigate("/seller/gigs/create");
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-xl text-gray-600">
          <Spinner />
          Loading gigs...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] pt-28 px-8 md:px-32">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold">Your Gigs</h3>
        <button
          onClick={handleCreateGig}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus />
          Create New Gig
        </button>
      </div>

      {myGigs.length === 0 ? (
        <div className="flex items-center justify-center py-16 px-6 bg-white rounded-2xl shadow-md">
          <div className="text-center">
            <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-3">
              No Gigs Yet
            </h2>
            <p className="text-gray-500 mb-6">
              You haven’t created any gigs. Start by creating your first one.
            </p>
            <button
              onClick={handleCreateGig}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200"
            >
              Create Your First Gig
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Delivery Time</th>
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
                    <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {gig.title}
                    </th>
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
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          gig.status === "active"
                            ? "bg-green-100 text-green-800"
                            : gig.status === "paused"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {gig.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            navigate(`/seller/gigs/${gig.id}/edit`)
                          }
                          className="text-blue-600 hover:text-blue-700"
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
