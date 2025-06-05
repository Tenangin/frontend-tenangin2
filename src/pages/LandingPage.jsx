import LandingNavbar from "../components/LandingNavbar";
import HeroSection from "../components/HeroSection";
import FeatureSection from "../components/FeatureSection";
import Footer from "../components/FooterSection";
import WhyTenanginSection from "../components/WhyTenanginSection";
import CTASection from "../components/CTASection";

function LandingPage() {
  return (
    <>
      {/* <LandingNavbar /> */}
      <main id="main-content">
        <HeroSection />
        <FeatureSection />
        <WhyTenanginSection />
        <CTASection />
      </main>
      {/* <Footer /> */}
    </>
  );
}

export default LandingPage;
