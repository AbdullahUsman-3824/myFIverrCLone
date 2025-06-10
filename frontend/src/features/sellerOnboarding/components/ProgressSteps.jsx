import { FiCheck } from "react-icons/fi";

const ProgressSteps = ({ step, stepLabels }) => {
  const stepKeys = Object.keys(stepLabels);

  return (
    <div className="flex justify-center mb-8">
      {stepKeys.map((key) => {
        const index = parseInt(key);
        const isActive = step >= index;
        const isComplete = step > index;
        return (
          <div key={key} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isActive ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              {isComplete ? (
                <FiCheck className="text-white" />
              ) : (
                <span className="text-white">{index}</span>
              )}
            </div>
            {index < stepKeys.length && (
              <div
                className={`w-16 h-1 mx-2 ${
                  isComplete ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressSteps;
