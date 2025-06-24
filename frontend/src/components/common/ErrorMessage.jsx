import { FiAlertCircle } from "react-icons/fi";

const ErrorMessage = ({ error }) =>
  error ? (
    <div
      className="flex items-center gap-1 text-red-600 text-sm mt-1"
      role="alert"
      aria-live="assertive"
    >
      <FiAlertCircle size={14} aria-hidden="true" />
      <span>{error}</span>
    </div>
  ) : null;

export default ErrorMessage;
