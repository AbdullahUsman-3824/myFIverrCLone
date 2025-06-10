import useSellerForm from "../hooks/useSellerForm";
import useSellerOnboardingRequest from "../hooks/useSellerOnboardingRequest";
import {
  Step1,
  Step2,
  Step3,
  Step4,
  FormNavigation,
  ProgressSteps,
} from "../components";

const SellerOnboarding = () => {
  const {
    step,
    formData,
    setFormData,
    handleInputChange,
    handleNext,
    handleBack,
    errors,
    setErrors,
  } = useSellerForm();
  const { isLoading, handleSubmit } = useSellerOnboardingRequest();

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1 formData={formData} handleInputChange={handleInputChange} />
        );
      case 2:
        return <Step2 formData={formData} setFormData={setFormData} />;
      case 3:
        return <Step3 formData={formData} setFormData={setFormData} />;
      case 4:
        return <Step4 formData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

  const stepLabels = {
    1: "Basic Information",
    2: "Education",
    3: "Skills & Language",
    4: "Portfolio Items",
  };

  return (
    <div className="min-h-[80vh] pt-28 px-8 md:px-32">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-gray-600">
            Step {step} of 4: {stepLabels[step] || "Unknown Step"}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <ProgressSteps step={step} stepLabels={stepLabels} />
          <form
            onSubmit={
              step === 4
                ? (e) => {
                    e.preventDefault();
                    handleSubmit(formData);
                  }
                : (e) => {
                    e.preventDefault();
                    handleNext();
                  }
            }
          >
            {Object.keys(errors).length > 0 && (
              <div className="mt-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded">
                <ul className="list-disc list-inside space-y-1">
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field}>
                      <strong>{field.replaceAll("_", " ")}:</strong> {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {renderStep()}
            <FormNavigation
              step={step}
              handleBack={handleBack}
              isLoading={isLoading}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerOnboarding;
