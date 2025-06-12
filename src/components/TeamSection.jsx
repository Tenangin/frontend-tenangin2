import React from 'react';

const teamMembers = [
  {
    name: "Nabila Lailatanzila",
    university: "Universitas Islam Negeri Sunan Gunung Djati, Bandung",
    cohortId: "MC222D5X1216",
    program: "Coding Camp powered by DBS Foundation 2025",
    role: "Machine Learning Developer",
    description: "Passionate about building impactful web applications with clean and maintainable code."
  },
  {
    name: "Riza Anwar Fadil",
    university: "Universitas Islam Negeri Sunan Gunung Djati, Bandung",
    cohortId: "MC222D5Y1739",
    program: "Coding Camp powered by DBS Foundation 2025",
    role: "Machine Learning Developer",
    description: "Loves crafting intuitive UI experiences and bringing designs to life."
  },
  {
    name: "Muhammad Rizki Al-Fathir",
    university: "Universitas Islam Negeri Sunan Gunung Djati, Bandung",
    cohortId: "MC222D5Y0633 ",
    program: "Coding Camp powered by DBS Foundation 2025",
    role: "Machine Learning Developerr",
    description: "Focused on developing scalable APIs and ensuring data integrity."
  },
  {
    name: "Mochamed Fadhlan Tuhairi",
    university: "Institut Teknologi dan Bisnis Bina Sarana Global, Tangerang",
    cohortId: "FC511D5Y2269",
    program: "Coding Camp powered by DBS Foundation 2025",
    role: "Full-Stack Developer",
    description: "Enjoys creating smooth and efficient mobile app experiences."
  },
];

const TeamSection = () => {
  return (
    <section className="my-5">
      <h2 className="mb-4 text-center">Meet the Team</h2>
      <p className="text-center mb-4 fst-italic">
        We are four university students from different universities currently enrolled in the Coding Camp powered by DBS Foundation 2025.
      </p>
      <div className="row justify-content-center">
        {teamMembers.map((member, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div className="card h-100 shadow-sm d-flex flex-column justify-content-center p-4 text-center team-card hover-animate">
              <h5 className="card-title">{member.name}</h5>
              <p className="card-text text-muted mb-1"><small>{member.cohortId}</small></p>
              <p className="card-text text-muted mb-1">{member.university}</p>
              <h6 className="text-primary">{member.role}</h6>
              <p className="card-text text-muted fst-italic mb-2">{member.program}</p>
            </div>
          </div>
        ))}
      </div>
      <style jsx="true">{`
        .team-card {
          transition: box-shadow 0.3s, transform 0.3s, border-color 0.3s;
          border: 2px solid #e5e7eb;
        }
        .team-card:hover, .team-card:focus {
          box-shadow: 0 8px 24px rgba(37,99,235,0.15), 0 1.5px 6px rgba(0,0,0,0.08);
          border-color: #2563eb;
          transform: translateY(-8px) scale(1.03);
          background: #f5faff;
          cursor: pointer;
        }
      `}</style>
    </section>
  );
};

export default TeamSection;
