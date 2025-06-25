import {
  CredentialWrapper,
  EmailVerification,
  ResetPassword,
  ForgotPassword,
} from "../features/auth";

const authRoutes = {
  element: <CredentialWrapper />,
  children: [
    { path: "/verify-email", element: <EmailVerification /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/reset-password/:uid/:token", element: <ResetPassword /> },
  ],
};

export default authRoutes;
