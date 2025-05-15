import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation({ signOut, user }) {
  return (
    <nav className="nav-bar">
      <div className="nav-content">
        <div className="nav-brand">
          Student Tracker
        </div>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/log" className="nav-link">Log Entry</Link>
          <button onClick={signOut} className="nav-button">
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation; 