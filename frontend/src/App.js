import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Dashboard from './components/Dashboard';
import LogEntry from './components/LogEntry';
import Navigation from './components/Navigation';
import './App.css';

const formFields = {
  signIn: {
    username: {
      placeholder: 'Enter your email',
      isRequired: true,
    },
    password: {
      placeholder: 'Enter your password',
      isRequired: true,
    },
  },
  signUp: {
    email: {
      placeholder: 'Enter your email',
      isRequired: true,
    },
    password: {
      placeholder: 'Enter your password',
      isRequired: true,
    },
    confirm_password: {
      placeholder: 'Confirm your password',
      isRequired: true,
    },
  },
};

function App() {
  return (
    <Authenticator 
      formFields={formFields}
      components={{
        Header: () => (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <h1 style={{ 
              fontWeight: 'bold', 
              fontSize: '1.5rem',
              color: '#1976d2',
              marginBottom: '2rem'
            }}>
              Welcome to Student Health & Productivity Tracker
            </h1>
          </div>
        )
      }}
    >
      {({ signOut, user }) => (
        <Router>
          <div className="app">
            <Navigation signOut={signOut} user={user} />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/log" element={<LogEntry />} />
              </Routes>
            </main>
          </div>
        </Router>
      )}
    </Authenticator>
  );
}

export default App; 