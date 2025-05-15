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
          <div className="custom-header" style={{ 
            textAlign: 'center', 
            padding: '2.5rem 1.5rem',
            background: 'linear-gradient(to right, #f8f9fa, #ffffff, #f8f9fa)',
            borderRadius: '12px',
            margin: '1.5rem 0',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(0, 112, 243, 0.1)'
          }}>
            <h1 style={{ 
              fontWeight: '600', 
              fontSize: '2.25rem',
              background: 'linear-gradient(135deg, #0070f3 0%, #00a3ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '0',
              padding: '0',
              lineHeight: '1.3',
              letterSpacing: '-0.02em'
            }}>
              Welcome to Student Health and Productivity Tracker
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