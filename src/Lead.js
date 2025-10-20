import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Nav from "./navbar.js";
import "./style/Lead.css";


function Lead() {
  const navigate = useNavigate();
    const [leaderplan, setPlan1] = useState("");
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
        const fetchLeaderPlan = async () => {
      try {
        const response = await fetch("/reskill", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: employee.name }), 
        });
  
        const data = await response.json();
        setPlan1(data.plan);
      } catch (err) {
        console.error("Error:", err);
      }
    }
    if (employee) {
        fetchLeaderPlan();
      }
    }, [employee]);
    if (!leaderplan) return <p>Loading ....</p>
    return <div>
      <Nav />
      <h1>Leadership skills to be developed : </h1>
       {leaderplan.split('\n').map((line, idx) => (
            <h3 key={idx} className='line'>{line}</h3>
        ))}
    </div>;
};

export default Lead;
