import React from 'react';

const teamMembers = [
  {
    name: "Aulia Rahman",
    university: "Universitas Indonesia",
    cohortId: "Cohort 01",
    program: "Coding Camp powered by DBS Foundation 2025",
    role: "Full-stack Developer",
    description: "Passionate about building impactful web applications with clean and maintainable code."
  },
  {
    name: "Bayu Santoso",
    university: "Institut Teknologi Bandung",
    cohortId: "Cohort 02",
    program: "Coding Camp powered by DBS Foundation 2025",
    role: "Frontend Developer",
    description: "Loves crafting intuitive UI experiences and bringing designs to life."
  },
  {
    name: "Citra Dewi",
    university: "Universitas Gadjah Mada",
    cohortId: "Cohort 03",
    program: "Coding Camp powered by DBS Foundation 2025",
    role: "Backend Developer",
    description: "Focused on developing scalable APIs and ensuring data integrity."
  },
  {
    name: "Dimas Prakoso",
    university: "Universitas Airlangga",
    cohortId: "Cohort 04",
    program: "Coding Camp powered by DBS Foundation 2025",
    role: "Mobile Developer",
    description: "Enjoys creating smooth and efficient mobile app experiences."
  },
  {
    name: "Erika Widya",
    university: "Universitas Brawijaya",
    cohortId: "Cohort 05",
    program: "Coding Camp powered by DBS Foundation 2025",
    role: "UI/UX Designer",
    description: "Dedicated to designing user-friendly interfaces that delight users."
  },
  {
    name: "Fajar Nugroho",
    university: "Universitas Diponegoro",
    cohortId: "Cohort 06",
    program: "Coding Camp powered by DBS Foundation 2025",
    role: "DevOps Engineer",
    description: "Passionate about automating processes and maintaining reliable systems."
  },
];

const TeamSection = () => {
  return (
    <section className="my-5">
      <h2 className="mb-4 text-center">Meet the Team</h2>
      <p className="text-center mb-4 fst-italic">
        We are six university students from different universities currently enrolled in the Coding Camp powered by DBS Foundation 2025.
      </p>
      <div className="row">
        {teamMembers.map((member, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div className="card h-100 shadow-sm d-flex flex-column justify-content-center p-4 text-center">
              <h5 className="card-title">{member.name}</h5>
              <p className="card-text text-muted mb-1">{member.university}</p>
              <p className="card-text text-muted mb-1"><small>{member.cohortId}</small></p>
              <p className="card-text text-muted fst-italic mb-2">{member.program}</p>
              <h6 className="text-primary">{member.role}</h6>
              <p>{member.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
