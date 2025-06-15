import ErrorMessage from "./ErrorMessage";

const InputField = ({ label, error, children, required = false, htmlFor }) => (
  <div>
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-gray-700 mb-2"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    <ErrorMessage error={error} />
  </div>
);

export default InputField;
