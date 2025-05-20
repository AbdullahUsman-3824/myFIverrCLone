import HomeBanner from "../features/landing/components/HeroBanner";
import PopularServices from "../features/landing/components/PopularServices";
import Services from "../features/landing/components/Services";
import FiverrBusiness from "../features/landing/components/FiverrBusiness";
import JoinFiverr from "../features/landing/components/JoinFiverr";

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
