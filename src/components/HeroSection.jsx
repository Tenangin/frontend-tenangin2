import React from "react";
import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <section
      style={{
        backgroundColor: "#f4f7ff",
        padding: "120px 0",
      }}
    >
      <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between gap-5">
        {/* Kiri: Teks */}
        <div className="col-md-7">
          <h1 className="fw-bold display-5 text-primary" style={{fontSize: "53px"}}>
            Let your thoughts breathe, <br />
            and your heart rest
          </h1>
          <p className="text-secondary mt-3" style={{fontSize: "17px"}}>
            Tenangin is here to support your mental well-being through
            journaling, mindful reflections, and a caring AI companion who
            listens anytime you need.
          </p>
          <Link
            to="/explore"
            className="btn btn-outline-primary rounded-pill px-4 py-2 mt-4"
          >
            Let’s Explore
          </Link>
        </div>

        {/* Kanan: Gambar */}
        <div className="col-md-5 text-center">
          <img
            src="/images/hero-brain.svg"
            alt="Hero Illustration"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
