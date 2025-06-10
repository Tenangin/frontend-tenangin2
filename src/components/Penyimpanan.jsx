import React from "react";

const features = [
  {
    icon: "📝",
    title: "Journaling",
    desc: "Write and release your thoughts privately, whenever you need.",
  },
  {
    icon: "🤖",
    title: "Chatbot",
    desc: "Talk to our AI companion — always here to listen without judgment.",
  },
  {
    icon: "🩺",
    title: "Health Check",
    desc: "Self-check your mental state to anticipate early signs.",
  },
  {
    icon: "🧠",
    title: "Counseling Finder",
    desc: "Discover trusted counseling centers near you.",
  },
  {
    icon: "📖",
    title: "Daily Reflection",
    desc: "Reflect on your day to help with mindfulness and balance.",
  },
];

function FeatureSection() {
  return (
    <section className="py-5 bg-white">
      <div className="container">
        <div className="row align-items-start">
          {/* Left Column: Heading */}
          <div className="col-md-5 mb-4 mb-md-0">
            <h2 className="fw-bold text-dark mb-3">
              Support for every step of your healing
            </h2>
            <p className="text-secondary">
              Tenangin offers holistic tools to help you manage emotions, develop healthy habits, and connect with the right support — all in one place.
            </p>
          </div>

          {/* Right Column: Features Grid */}
          <div className="col-md-7">
            <div className="row">
              {features.map((feature, index) => (
                <div key={index} className="col-sm-6 mb-4">
                  <div className="d-flex">
                    <div className="fs-4 text-primary me-3">{feature.icon}</div>
                    <div>
                      <h6 className="fw-bold text-primary">{feature.title}</h6>
                      <p className="text-secondary small mb-0">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureSection;
