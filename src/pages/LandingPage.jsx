import React from "react";
import LandingNavbar from "../components/LandingNavbar";
import HeroSection from "../components/HeroSection";
import FeatureSection from "../components/FeatureSection";
import Footer from "../components/FooterSection";
import WhyTenanginSection from "../components/WhyTenanginSection";
import CTASection from "../components/CTASection";
import useInView from "../hooks/useInView";
import "../styles/LandingPageAnimations.css";

function LandingPage() {
  const [heroRef, heroVisible] = useInView({ threshold: 0.1 });
  const [featureRef, featureVisible] = useInView({ threshold: 0.1 });
  const [whyRef, whyVisible] = useInView({ threshold: 0.1 });
  const [ctaRef, ctaVisible] = useInView({ threshold: 0.1 });

  return (
    <>
      {/* <LandingNavbar /> */}
      <main id="main-content">
        <div
          ref={heroRef}
          className={`fade-in-section ${heroVisible ? "is-visible" : ""}`}
        >
          <HeroSection />
        </div>
        <div
          ref={featureRef}
          className={`fade-in-section ${featureVisible ? "is-visible" : ""}`}
        >
          <FeatureSection />
        </div>
        <div
          ref={whyRef}
          className={`fade-in-section ${whyVisible ? "is-visible" : ""}`}
        >
          <WhyTenanginSection />
        </div>
        <div
          ref={ctaRef}
          className={`fade-in-section ${ctaVisible ? "is-visible" : ""}`}
        >
          <CTASection />
        </div>
      </main>
      {/* <Footer /> */}
    </>
  );
}

export default LandingPage;
