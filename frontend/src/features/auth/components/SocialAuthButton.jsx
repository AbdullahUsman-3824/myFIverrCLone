const SocialAuthButton = ({
  icon: Icon,
  text,
  bgColor = "",
  textColor = "",
  border = "",
  onClick
}) => (
  <button
    type="button"
    className={`${bgColor} ${textColor} ${border} p-3 font-medium flex items-center justify-center relative rounded-md hover:opacity-90 transition-opacity`}
    onClick={onClick}
    disabled={false}
  >
    <Icon className="absolute left-4 text-2xl" />
    {text}
  </button>
);

export default SocialAuthButton;