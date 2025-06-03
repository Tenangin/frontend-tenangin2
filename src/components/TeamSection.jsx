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
    name: "Citra Dewi",
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
  {
    name: "Najmi Iqbal Hanif ",
    university: "Universitas Telkom, Bandung",
    cohortId: "FC012D5Y0322",
    program: "Coding Camp powered by DBS Foundation 2025",
    role: "Front-End Designer",
    description: "Dedicated to designing user-friendly interfaces that delight users."
  },
  {
    name: "Alwan Irfan F. Rasyid",
    university: "Universitas Handayani Makassar",
    cohortId: "Cohort 06",
    program: "Coding Camp powered by DBS Foundation 2025",
    role: "Back-End Developer",
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
              <p className="card-text text-muted mb-1"><small>{member.cohortId}</small></p>
              <p className="card-text text-muted mb-1">{member.university}</p>
              <h6 className="text-primary">{member.role}</h6>
              <p className="card-text text-muted fst-italic mb-2">{member.program}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
