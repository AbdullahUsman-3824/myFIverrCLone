const Spinner = ({ size = 4, color = "white" }) => (
  <div 
    className={`animate-spin rounded-full h-${size} w-${size} border-b-2 border-${color}`}
    aria-label="Loading"
  />
);

export default Spinner;