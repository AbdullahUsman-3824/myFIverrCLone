import React, { useState } from "react";
import api from "../../../utils/apiClient";
import { GIG_ROUTE } from "../../../utils/constants";
import { FiTrash2 } from "react-icons/fi";
import ConfirmModal from "../../../components/common/ConfirmModal";

const DeleteGigButton = ({ gigId, onDeleted }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`${GIG_ROUTE}${gigId}/`);
      onDeleted();
    } catch (error) {
      console.error("Error deleting gig:", error);
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="text-red-600 hover:text-red-700"
      >
        <FiTrash2 className="w-5 h-5" />
      </button>
      <ConfirmModal
        isOpen={showConfirm}
        title="Delete Gig"
        message="Are you sure you want to delete this gig? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
        loading={loading}
      />
    </>
  );
};

export default DeleteGigButton;
