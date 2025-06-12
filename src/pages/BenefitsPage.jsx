import React from 'react';
import LandingNavbar from '../components/LandingNavbar';
import Footer from '../components/FooterSection';
import useInView from '../hooks/useInView';
import '../styles/LandingPageAnimations.css';

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
  const [heroRef, heroVisible] = useInView({ threshold: 0.1 });
  const [introRef, introVisible] = useInView({ threshold: 0.1 });
  const [benefitsSectionRef, benefitsSectionVisible] = useInView({ threshold: 0.1 }); // Use a single ref for the section
  const [ctaRef, ctaVisible] = useInView({ threshold: 0.1 });

  // Use an array of refs and an array of visibility states
  // We'll create these inside the map function for each benefit
  // Or, if you want to manage them centrally, you can do this:
  const [benefitVisibilities, setBenefitVisibilities] = React.useState(benefits.map(() => false));

  // Create refs for each benefit card
  const benefitRefs = React.useRef([]);
  benefitRefs.current = benefits.map((_, i) => benefitRefs.current[i] ?? React.createRef());

  // Use useEffect to observe visibility for each benefit ref
  React.useEffect(() => {
    const observers = [];

    benefitRefs.current.forEach((ref, index) => {
      if (!ref.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setBenefitVisibilities(prev => {
                if (prev[index]) return prev; // already visible
                const newVisibilities = [...prev];
                newVisibilities[index] = true;
                return newVisibilities;
              });
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(ref.current);
      observers.push(observer);
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [benefits]);


  return (
    <>
      <div className="container my-3">
        {/* Hero Section */}
        <div
          ref={heroRef}
          className={`fade-in-section p-5 text-center rounded ${
            heroVisible ? 'is-visible' : ''
          }`}
          style={{ backgroundColor: '#4a90e2', color: 'white', marginBottom: '3rem' }}
        >
          <h1 className="display-4">Benefits of Using Tenangin</h1>
          <p className="lead">Empowering students to manage their mental health effectively and safely.</p>
        </div>

        {/* Introduction Section */}
        <section
          ref={introRef}
          className={`fade-in-section mb-5 ${introVisible ? 'is-visible' : ''}`}
        >
          <h2 className="mb-4 text-center">Why Choose Tenangin?</h2>
          <p className="lead text-center mx-auto" style={{ maxWidth: '700px' }}>
            Facing mental health challenges as a student can be daunting. Tenangin offers a comprehensive digital platform that bridges the gap between students and professional psychological support, removing traditional barriers to care.
          </p>
        </section>

        {/* Benefits Section */}
        <section
          ref={benefitsSectionRef} // Keep this for overall section visibility if needed
          className={`row ${benefitsSectionVisible ? 'is-visible' : ''}`} // Apply animation if the whole section is visible
        >
          {benefits.map((benefit, index) => {
            const isVisible = benefitVisibilities[index]; // Get visibility from state

            return (
              <div className="col-md-6 mb-4" key={index}>
                <div
                  ref={benefitRefs.current[index]}
                  className={`fade-in-section card h-100 shadow-sm benefit-card ${
                    isVisible ? 'is-visible' : ''
                  }`}
                >
                  <div className="card-body">
                    <h5 className="card-title text-primary">{benefit.title}</h5>
                    <p className="card-text">{benefit.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Call-to-Action Section */}
        <section
          ref={ctaRef}
          className={`my-5 text-center p-5 bg-light rounded ${
            ctaVisible ? 'is-visible' : ''
          }`}
        >
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
      <style jsx="true">{`
        .benefit-card {
          transition: box-shadow 0.3s, transform 0.3s, border-color 0.3s;
          border: 2px solid #f3f4f6;
          cursor: pointer;
        }
        .benefit-card:hover, .benefit-card:focus {
          box-shadow: 0 8px 24px rgba(67,97,238,0.15), 0 1.5px 6px rgba(0,0,0,0.08);
          border-color: #4361ee;
          transform: translateY(-8px) scale(1.03);
          background: #f5faff;
        }
      `}</style>
    </>
  );
};

export default BenefitsPage;