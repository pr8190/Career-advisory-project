import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useIdleTimer from './useIdleTimer'; // Import the hook
//import './Dashboard.css';
import MentalSupportChat from './mental.js';

const Dashboard = () => {
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

  // Add idle timer (5 minutes of inactivity)
  useIdleTimer(5); // Set to 5 minutes, change to 10 for 10 minutes

  useEffect(() => {
    const loggedInEmployee = localStorage.getItem('loggedInEmployee');
    
    if (!loggedInEmployee) {
      navigate('/login');
    } else {
      setEmployee(JSON.parse(loggedInEmployee));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('loggedInEmployee');
    navigate('/login');
  };

  if (!employee) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>📊 Employee Portal</h1>
        </div>
        <div className="header-right">
          <span className="user-badge">{employee.name}</span>
          <button onClick={handleLogout} className="logout-button" >
            Logout 🚪
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>👋 Welcome back, {employee.name}!</h2>
          <p className="welcome-subtitle">Here's your employee information</p>
          
          <div className="employee-info-grid">
            <div className="info-item">
              <span className="info-label">🆔 Employee ID : </span>
              <span className="info-value">{employee.employeeId}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">👤 Full Name : </span>
              <span className="info-value">{employee.name}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">📧 Email : </span>
              <span className="info-value">{employee.email}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">💼 Role</span>
              <span className="info-value role-badge">{employee.role}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">🏢 Department</span>
              <span className="info-value">{employee.department}</span>
            </div>
          </div>
        </div>

        {employee.role === 'Admin' && (
          <div className="admin-panel">
            <h3>🔑 Admin Panel</h3>
            <p>You have administrative access to manage employees and settings.</p>
          </div>
        )}

        {employee.role === 'Manager' && (
          <div className="manager-panel">
            <h3>📈 Manager Dashboard</h3>
            <p>Access team performance metrics and reports here.</p>
          </div>
        )}
      </div>
      <div><MentalSupportChat/></div>
    </div>
  );
};

export default Dashboard;