import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/Dashboard" },
    { name: "Journaling", path: "/Journaling" },
    { name: "Teno Bot", path: "/Chatbot" },
    { name: "HealthCheck", path: "/HealthCheck" },
    { name: "Profile", path: "/Profile" },
  ];

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredResults([]);
    } else {
      const results = menuItems.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredResults(results);
    }
  }, [searchTerm]);

  const handleSelect = (item) => {
    setSearchTerm("");
    setFilteredResults([]);
    navigate(item.path);
  };

  return (
    <div className="position-relative">
      <input
        type="text"
        className="form-control rounded-pill"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        autoComplete="off"
      />
      {searchTerm && filteredResults.length > 0 && (
        <ul
          className="search-results list-group position-absolute mt-2"
          style={{
            zIndex: 1000,
            maxHeight: "200px",
            overflowY: "auto",
            width: "200px",
          }}
        >
          {filteredResults.map((item, index) => (
            <li
              key={index}
              className="list-group-item list-group-item-action"
              onClick={() => handleSelect(item)}
              style={{ cursor: "pointer" }}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
