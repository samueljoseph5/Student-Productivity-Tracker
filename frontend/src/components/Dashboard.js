import React, { useState, useEffect } from 'react';
import { API, Auth } from 'aws-amplify';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import './Dashboard.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthAndFetchLogs();
  }, []);

  const checkAuthAndFetchLogs = async () => {
    try {
      console.log('Checking authentication status...');
      const session = await Auth.currentSession();
      console.log('Authentication successful, session:', session);
      // If authenticated, fetch logs
      await fetchLogs();
    } catch (err) {
      console.error('Authentication error:', err);
      if (err.code === 'NoCurrentSession') {
        setError('Please sign in to view your logs');
      } else {
        setError(`Authentication error: ${err.message}`);
      }
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      console.log('Fetching logs from API...');
      const response = await API.get('studentTrackerApi', '/logs');
      console.log('API Response:', response);
      
      // Check if response has logs property
      if (!response || !response.logs) {
        console.error('Invalid response format:', response);
        throw new Error('Invalid response format from server');
      }
      
      // Sort logs by timestamp
      const sortedLogs = response.logs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      console.log('Sorted logs:', sortedLogs);
      
      setLogs(sortedLogs);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching logs:', err);
      // Check for specific error types
      if (err.response) {
        console.error('Error response:', err.response);
        setError(`Server error: ${err.response.error || err.message}`);
      } else if (err.code === 'NetworkError') {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(err.message || 'Failed to fetch logs. Please try again later.');
      }
      setLoading(false);
    }
  };

  const getProductivityData = () => {
    const productivityCounts = {
      High: 0,
      Medium: 0,
      Low: 0
    };

    logs.forEach(log => {
      productivityCounts[log.productivity]++;
    });

    return {
      labels: ['High', 'Medium', 'Low'],
      datasets: [{
        data: [productivityCounts.High, productivityCounts.Medium, productivityCounts.Low],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }]
    };
  };

  const getTrendData = () => {
    const productivityValues = {
      High: 3,
      Medium: 2,
      Low: 1
    };

    return {
      labels: logs.map(log => new Date(log.timestamp).toLocaleDateString()),
      datasets: [{
        label: 'Productivity Trend',
        data: logs.map(log => productivityValues[log.productivity]),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="charts-container">
        <div className="chart-wrapper">
          <h2>Productivity Distribution</h2>
          <div className="chart">
            <Pie data={getProductivityData()} />
          </div>
        </div>
        
        <div className="chart-wrapper">
          <h2>Productivity Trend</h2>
          <div className="chart">
            <Line 
              data={getTrendData()}
              options={{
                scales: {
                  y: {
                    min: 0,
                    max: 4,
                    ticks: {
                      stepSize: 1,
                      callback: (value) => {
                        const labels = ['', 'Low', 'Medium', 'High'];
                        return labels[value];
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="logs-container">
        {logs.length === 0 ? (
          <p className="no-logs">No logs found. Start by adding your first log entry!</p>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="log-card">
              <div className="log-header">
                <span className="log-date">{new Date(log.timestamp).toLocaleDateString()}</span>
                <span className={`log-productivity ${log.productivity.toLowerCase()}`}>
                  {log.productivity}
                </span>
              </div>
              <div className="log-content">
                <p><strong>Feedback:</strong> {log.feedback}</p>
                <p><strong>Blockers:</strong> {log.blockers}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard; 