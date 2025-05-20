const ErrorMessage = ({ message }) => (
  message ? (
    <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md mb-4">
      {message}
    </div>
  ) : null
);

export default ErrorMessage;