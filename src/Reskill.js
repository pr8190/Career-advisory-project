import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Nav from "./navbar.js";

function Reskill() {
  const navigate = useNavigate();
    const [reskillplan, setPlan2] = useState("");
    const [employee, setEmployee] = useState(null);
    useEffect(() => {
      const loggedInEmployee = localStorage.getItem('loggedInEmployee');
      if (!loggedInEmployee) {
        navigate('/login');
      } else {
        setEmployee(JSON.parse(loggedInEmployee));
      }
    }, [navigate]);
    useEffect(() => {
        const fetchReskillPlan = async () => {
          try {
            const response = await fetch("http://localhost:5001/chat2.0", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: employee.name, department: employee.department }), 
            });
      
            const data = await response.json();
            setPlan2(data.plan);
          } catch (err) {
            console.error("Error:", err);
          }
        };
        if (employee) {
          fetchReskillPlan();
        }
      }, [employee]);
      if (!reskillplan) {
        return <p>Loading employee data...</p>;
      }
      return <div>
        <Nav />
        {reskillplan.split('\n').map((line, idx) => (
            <p key={idx}>{line}</p>
        ))}
      </div>;
}

export default Reskill;