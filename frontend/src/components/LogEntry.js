import React, { useState } from 'react';
import { API, Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import './LogEntry.css';

function LogEntry() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productivity: 'Medium',
    feedback: '',
    blockers: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check authentication first
      console.log('Checking authentication before submitting log...');
      const session = await Auth.currentSession();
      console.log('Authentication successful, proceeding with log submission');

      // Validate form data
      if (!formData.feedback.trim()) {
        throw new Error('Feedback is required');
      }

      console.log('Submitting log entry with data:', formData);
      const response = await API.post('studentTrackerApi', '/logs', {
        body: formData
      });
      console.log('Log entry submitted successfully:', response);

      // Navigate to dashboard on success
      navigate('/dashboard');
    } catch (err) {
      console.error('Error submitting log entry:', err);
      
      // Handle specific error cases
      if (err.code === 'NoCurrentSession') {
        setError('Please sign in to submit a log entry');
      } else if (err.response) {
        // Handle API error response
        const errorData = err.response;
        console.error('API Error response:', errorData);
        setError(errorData.error || errorData.message || 'Failed to submit log entry');
      } else if (err.message === 'Feedback is required') {
        setError(err.message);
      } else {
        setError('Failed to submit log entry. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="log-entry">
      <h1>Log Entry</h1>
      {error && (
        <div className="error-message">
          {error}
          {error.includes('Please sign in') && (
            <button 
              onClick={() => window.location.reload()} 
              className="retry-button"
            >
              Retry
            </button>
          )}
        </div>
      )}
      <form onSubmit={handleSubmit} className="log-form">
        <div className="form-group">
          <label htmlFor="productivity">Productivity Level</label>
          <select
            id="productivity"
            name="productivity"
            value={formData.productivity}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="feedback">Class Feedback</label>
          <textarea
            id="feedback"
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            placeholder="How was the class? What did you learn?"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="blockers">Blockers</label>
          <textarea
            id="blockers"
            name="blockers"
            value={formData.blockers}
            onChange={handleChange}
            placeholder="Any issues or blockers you encountered?"
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          className="submit-button" 
          disabled={loading || !formData.feedback.trim()}
        >
          {loading ? 'Submitting...' : 'Submit Log Entry'}
        </button>
      </form>
    </div>
  );
}

export default LogEntry; 