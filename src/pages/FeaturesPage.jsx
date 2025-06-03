import React from 'react';
import LandingNavbar from '../components/LandingNavbar';
import Footer from '../components/FooterSection';


const FeaturesPage = () => {
  return (
    <>
      <main id="main-content" className="container my-3">
        {/* Hero Section */}
        <div className="p-5 text-center rounded" style={{backgroundColor: '#4a90e2', color: 'white', marginBottom: '3rem'}}>
          <h1 className="display-4">Features of Tenangin</h1>
          <p className="lead">Empowering students to take charge of their mental health.</p>
        </div>

      {/* Introduction Section */}
      <section className="my-5">
        <h2 className="mb-4 text-center">Why Mental Health Matters</h2>
        <p className="lead text-center mx-auto" style={{ maxWidth: '700px' }}>
          Mental health issues among students in Indonesia are a growing concern, with over 30% experiencing mental health disorders. Tenangin aims to provide accessible digital solutions to support students in managing their mental well-being effectively.
        </p>
      </section>

      {/* Features Section */}
      <section className="my-5">
        <h2 className="mb-4 text-center">Our Key Features</h2>
        <div className="row">
          {/* Feature 1: Self-Assessment */}
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">Self-Assessment</h5>
                <p className="card-text">
                  A tool to help students recognize their mental health status through a series of questions and assessments, providing insights into their emotional well-being.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 2: Counselor Recommendation */}
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">Counselor Recommendation</h5>
                <p className="card-text">
                  A recommendation system that connects students with nearby counselors based on their location, making it easier to access professional help.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 3: Journaling */}
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">Journaling</h5>
                <p className="card-text">
                  A journaling feature that allows students to track their emotional progress over time, helping them reflect on their feelings and experiences.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 4: Interactive Chatbot */}
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">Interactive Chatbot</h5>
                <p className="card-text">
                  An AI-powered chatbot that provides instant support and guidance, answering common questions and offering resources for mental health.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="my-5 text-center p-5 bg-light rounded">
        <h2>Join Us in Promoting Mental Wellness</h2>
        <p className="lead mb-4">
          Together, we can create a supportive environment for students to thrive mentally and emotionally.
        </p>
        <a href="/contact" className="btn btn-primary btn-lg">
          Get Involved
        </a>
      </section>
    </main>
    {/* <Footer /> */}
    </>
  );
};

export default FeaturesPage;
