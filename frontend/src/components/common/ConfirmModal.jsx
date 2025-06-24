import React from "react";
import Spinner from "./Spinner";

const ConfirmModal = ({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 w-full max-w-md mx-4 relative animate-fadeIn">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h2>
        <p className="mb-6 text-gray-600">{message}</p>
        <div className="flex justify-around gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner />
                <span className="ml-2">Processing...</span>
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
