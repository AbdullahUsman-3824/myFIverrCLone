const FormNavigation = ({ step, handleBack, isLoading }) => {
  return (
    <div className="mt-8 flex justify-between">
      {step > 1 && (
        <button
          type="button"
          onClick={handleBack}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className={`ml-auto px-4 py-2 rounded-md text-white ${
          isLoading
            ? step === 4
              ? "bg-purple-400 cursor-not-allowed"
              : "bg-green-400 cursor-not-allowed"
            : step === 4
            ? "bg-purple-600 hover:bg-purple-700"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {isLoading ? "Processing..." : step === 4 ? "Complete Setup" : "Next"}
      </button>
    </div>
  );
};

export default FormNavigation;
