import Navbar from "../components/layout/Navbar";
import HomeBanner from "../components/landing/HeroBanner";
import PopularServices from "../components/landing/PopularServices";
import Services from "../components/landing/Services";
import FiverrBusiness from "../components/landing/FiverrBusiness";
import JoinFiverr from "../components/landing/JoinFiverr";
import Everything from "../components/landing/Everything";
import Footer from "../components/layout/Footer";

function Home() {
  return (
    <div>
      <HomeBanner />
      <PopularServices />
      <Services />
      <FiverrBusiness />
      <JoinFiverr />
      {/* <Everything /> */}
    </div>
  );
}
export default Home;
