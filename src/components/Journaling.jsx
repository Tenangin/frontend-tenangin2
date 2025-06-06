import React from "react";

const Journaling = () => {
  const journalingItems = ["Nextjs", "React"];

  return (
    <div className="col-md-6">
      <h6 className="text-primary mb-3">Journaling</h6>
      <div
        className="p-3 rounded-4 mb-3 d-flex justify-content-between"
        style={{ backgroundColor: "#EFF4FF" }}
      >
        <div>
          <h6 className="mb-1 fw-semibold">My Day</h6>
          <p className="text-muted small mb-0">
            Today felt a bit slow, but I managed to get some important things
            done...
          </p>
        </div>
        <span className="badge bg-primary rounded-pill">7:00 pm</span>
      </div>
      {journalingItems.map((item, idx) => (
        <div
          key={idx}
          className="p-3 rounded-4 d-flex justify-content-between align-items-center mb-3"
          style={{ backgroundColor: "#EFF4FF" }}
        >
          <div>
            <h6 className="mb-1 fw-semibold">Week 01 Assignment</h6>
            <small className="text-muted">{item} assignment</small>
          </div>
          <span className="badge bg-primary rounded-pill">7:00 pm</span>
        </div>
      ))}
    </div>
  );
};

export default Journaling;
