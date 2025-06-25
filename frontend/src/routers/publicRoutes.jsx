import Home from "../pages/Home";
import CategoryPage from "../pages/CategoryPage";
import GigDetail from "../features/gigs/pages/GigDetail";
import SellerOnboarding from "../features/sellerOnboarding/pages/SellerOnboarding";
import SearchResults from "../pages/SearchResults";
import SellerDetails from "../features/seller/pages/SellerDetails";

const publicRoutes = [
  { path: "/", element: <Home /> },
  { path: "/category/:categoryId", element: <CategoryPage /> },
  { path: "/gig/:gigId", element: <GigDetail /> },
  { path: "/become-a-seller", element: <SellerOnboarding /> },
  { path: "/search", element: <SearchResults /> },
  { path: "/:username", element: <SellerDetails /> },
];

export default publicRoutes;