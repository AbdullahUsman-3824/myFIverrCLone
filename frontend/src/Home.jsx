import Navbar from "./components/Navbar";
import HomeBanner from "./components/landing/HeroBanner";
import PopularServices from "./components/landing/PopularServices";
import Services from "./components/landing/Services";
import FiverrBusiness from "./components/landing/FiverrBusiness";
import JoinFiverr from "./components/landing/JoinFiverr";
// import Everything from "./Everything";
import Footer from "./components/Footer";

function Home() {
    return (
        <div>
            <Navbar/>
            <HomeBanner/>
            <PopularServices/>
            <Services/>
            <FiverrBusiness/>
            <JoinFiverr/>
            <Footer/>
            {/* <Everything/> */}
        </div>
    )
}
export default Home;