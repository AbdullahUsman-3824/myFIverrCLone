import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HOST } from "../../utils/constants";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import ConfirmModal from "../../components/common/ConfirmModal";

const SellerGigs = () => {
  const navigate = useNavigate();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [gigToDelete, setGigToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = () => {
    const dummyGigs = [
      {
        id: "gig1",
        title: "Professional Logo Design",
        category: "Graphics & Design",
        price: 50,
        deliveryTime: 3,
        status: "active",
      },
      {
        id: "gig2",
        title: "Modern Website Development",
        category: "Programming & Tech",
        price: 300,
        deliveryTime: 7,
        status: "active",
      },
      {
        id: "gig3",
        title: "SEO Optimization for Blog",
        category: "Digital Marketing",
        price: 100,
        deliveryTime: 2,
        status: "inactive",
      },
    ];
  
    setGigs(dummyGigs);
    setLoading(false);
  };

  const handleCreateGig = () => {
    navigate("/seller/gigs/create");
  };

  const handleDeleteClick = (gigId) => {
    setGigToDelete(gigId);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!gigToDelete) return;
    setDeleting(true);
    try {
      const response = await axios.delete(`${HOST}/api/seller/gigs/${gigToDelete}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setGigs(gigs.filter(gig => gig.id !== gigToDelete));
      }
    } catch (error) {
      console.error("Error deleting gig:", error);
    } finally {
      setDeleting(false);
      setShowConfirm(false);
      setGigToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setGigToDelete(null);
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading gigs...</div>
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

      {gigs.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-600 mb-4">You haven't created any gigs yet.</p>
          <button
            onClick={handleCreateGig}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Create your first gig
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Delivery Time
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {gigs.map((gig) => (
                  <tr
                    key={gig.id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {gig.title}
                    </th>
                    <td className="px-6 py-4">{gig.category}</td>
                    <td className="px-6 py-4">${gig.price}</td>
                    <td className="px-6 py-4">{gig.deliveryTime} days</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          gig.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {gig.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => navigate(`/seller/gigs/${gig.id}/edit`)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(gig.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={showConfirm}
        title="Delete Gig"
        message="Are you sure you want to delete this gig? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={deleting}
      />
    </div>
  );
};

export default SellerGigs; 