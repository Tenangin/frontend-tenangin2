import React from 'react';
import LandingNavbar from '../components/LandingNavbar';
import Footer from '../components/FooterSection';

const benefits = [
  {
    title: 'Accessible Mental Health Support',
    description: 'Tenangin provides easy access to self-care tools and mental health resources without barriers such as cost, time, or stigma.'
  },
  {
    title: 'Early Detection & Awareness',
    description: 'Our self-assessment feature helps students recognize mental health conditions early, enabling timely support and intervention.'
  },
  {
    title: 'Personalized Counselor Recommendations',
    description: 'The platform recommends nearby counselors based on student location, simplifying the process of finding professional help.'
  },
  {
    title: 'Emotional Monitoring with Journaling',
    description: 'Students can track their emotional progress and reflect on their feelings through our intuitive journaling feature.'
  },
  {
    title: 'Instant Support via Chatbot',
    description: 'Our interactive chatbot offers 24/7 guidance and answers to common mental health questions, providing immediate assistance.'
  },
  {
    title: 'Safe and Inclusive Environment',
    description: 'Tenangin fosters a stigma-free community where students can seek help confidentially and comfortably.'
  }
];

const BenefitsPage = () => {
  return (
    <>
    <div className="container my-3">
      {/* Hero Section */}
      <div className="p-5 text-center rounded" style={{backgroundColor: '#4a90e2', color: 'white', marginBottom: '3rem'}}>
        <h1 className="display-4">Benefits of Using Tenangin</h1>
        <p className="lead">Empowering students to manage their mental health effectively and safely.</p>
      </div>

      {/* Introduction Section */}
      <section className="mb-5">
        <h2 className="mb-4 text-center">Why Choose Tenangin?</h2>
        <p className="lead text-center mx-auto" style={{ maxWidth: '700px' }}>
          Facing mental health challenges as a student can be daunting. Tenangin offers a comprehensive digital platform that bridges the gap between students and professional psychological support, removing traditional barriers to care.
        </p>
      </section>

      {/* Benefits Section */}
      <section className="row">
        {benefits.map((benefit, index) => (
          <div className="col-md-6 mb-4" key={index}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-primary">{benefit.title}</h5>
                <p className="card-text">{benefit.description}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Call-to-Action Section */}
      <section className="my-5 text-center p-5 bg-light rounded">
        <h2>Start Your Journey to Better Mental Health</h2>
        <p className="lead mb-4">
          Join Tenangin today and take the first step towards a healthier, happier you.
        </p>
        <a href="/register" className="btn btn-primary btn-lg">
          Get Started
        </a>
      </section>
    </div>
    {/* <Footer /> */}
    </>
  );
};

export default BenefitsPage;
