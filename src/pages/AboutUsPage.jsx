import React from 'react';
import TeamSection from '../components/TeamSection';
import LandingNavbar from '../components/LandingNavbar';
import Footer from '../components/FooterSection';

const AboutUsPage = () => {
  return (
    <>
      <LandingNavbar />
      <div className="container my-5" style={{backgroundColor: '#f8f9fa'}}>
        {/* Hero Section */}
        <div className="p-5 text-center rounded" style={{backgroundColor: '#4a90e2', color: 'white', marginBottom: '3rem'}}>
          <h1 className="display-4">About Tenangin</h1>
          <p className="lead">Your trusted companion for mental wellness during your university journey.</p>
        </div>

        {/* Our Mission Section */}
        <section className="my-5">
          <h2 className="mb-4 text-center">Our Mission</h2>
          <p className="lead text-center mx-auto" style={{ maxWidth: '700px' }}>
            At Tenangin, we are dedicated to supporting the mental health of university students. Our goal is to provide approachable, reliable, and accessible resources to help students manage stress, anxiety, and other mental health challenges while pursuing their academic goals.
          </p>
        </section>

        {/* Team Section */}
        <TeamSection />

        {/* Contact Call-to-Action Section */}
        <section className="my-5 text-center p-5 bg-light rounded">
          <h2>Connect with Tenangin</h2>
          <p className="lead mb-4">
            Whether you want to learn more or collaborate with us, we'd love to hear from you!
          </p>
          <a href="mailto:contact@tenangin.com" className="btn btn-primary btn-lg">
            Contact Us
          </a>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default AboutUsPage;
