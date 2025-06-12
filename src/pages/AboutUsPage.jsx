import React from 'react';
import TeamSection from '../components/TeamSection';
import Footer from '../components/FooterSection';
import useInView from '../hooks/useInView';
import '../styles/LandingPageAnimations.css';

const AboutUsPage = () => {
  const [heroRef, heroVisible] = useInView({ threshold: 0.1 });
  const [missionRef, missionVisible] = useInView({ threshold: 0.1 });
  const [teamRef, teamVisible] = useInView({ threshold: 0.1 });
  const [contactRef, contactVisible] = useInView({ threshold: 0.1 });

  return (
    <>
      <main id="main-content" className="container my-3" style={{backgroundColor: '#f8f9fa'}}>
        {/* Hero Section */}
        <div
          ref={heroRef}
          className={`fade-in-section p-5 text-center rounded ${heroVisible ? 'is-visible' : ''}`}
          style={{backgroundColor: '#4a90e2', color: 'white', marginBottom: '3rem'}}
        >
          <h1 className="display-4">About Tenangin</h1>
          <p className="lead">Your trusted companion for mental wellness during your university journey.</p>
        </div>

        {/* Our Mission Section */}
        <section
          ref={missionRef}
          className={`fade-in-section my-5 ${missionVisible ? 'is-visible' : ''}`}
        >
          <h2 className="mb-4 text-center">Our Mission</h2>
          <p className="lead text-center mx-auto" style={{ maxWidth: '700px' }}>
            At Tenangin, we are dedicated to supporting the mental health of university students. Our goal is to provide approachable, reliable, and accessible resources to help students manage stress, anxiety, and other mental health challenges while pursuing their academic goals.
          </p>
        </section>

        {/* Team Section */}
        <div ref={teamRef} className={`fade-in-section ${teamVisible ? 'is-visible' : ''}`}>
          <TeamSection />
        </div>

        {/* Contact Call-to-Action Section */}
        <section
          ref={contactRef}
          className={`fade-in-section my-5 text-center p-5 bg-light rounded ${contactVisible ? 'is-visible' : ''}`}
        >
          <h2>Connect with Tenangin</h2>
          <p className="lead mb-4">
            Whether you want to learn more or collaborate with us, we'd love to hear from you!
          </p>
          <a href="mailto:contact@tenangin.com" className="btn btn-primary btn-lg">
            Contact Us
          </a>
        </section>
      </main>
      {/* <Footer /> */}
    </>
  );
};

export default AboutUsPage;
