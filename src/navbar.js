import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

function Nav() {
    const navigate = useNavigate();
        const [employee, setEmployee] = useState(null);
        const handleLogout = () => {
          localStorage.removeItem('loggedInEmployee');
          navigate('/login');
        };
        useEffect(() => {
              const loggedInEmployee = localStorage.getItem('loggedInEmployee');
              if (!loggedInEmployee) {
                navigate('/login');
              } else {
                setEmployee(JSON.parse(loggedInEmployee));
              }
            }, [navigate]);
            if (!employee) {
                return <p>Loading employee data...</p>;
              }
    return <header className="dashboard-header">
    <div className="header-left">
      <h1>ScaleUp</h1>
    </div>
    <div className="header-right">
      <button onClick={() => window.location.href = "/dashboard"}>Home</button>
      <button onClick={() => window.location.href = "/leadership"}>Leadership</button>
      <button onClick={() => window.location.href = "/reskill"}>Reskill</button>
      <button onClick={handleLogout} className="logout-button" >
        Logout 🚪
      </button>
      <span className="user-badge">{employee.name}</span>
    </div>
  </header>
}

export default Nav;