import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import './App.css'; // Import the CSS file for styling

const App = () => {
  const [githubEvents, setGithubEvents] = useState([]);
  const [username, setUsername] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`https://api.github.com/users/${username}/events`);
      setGithubEvents(response.data);
    } catch (error) {
      console.error('Error fetching GitHub events:', error);
    }
  };

  // Group events by date
  const dailyCounts = githubEvents.reduce((acc, event) => {
    const date = new Date(event.created_at).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  // Prepare data for heatmap
  const heatmapData = Object.keys(dailyCounts).map((date) => ({
    date: new Date(date),
    count: dailyCounts[date],
  }));

  return (
    <div className="app-container">
      <header>
        <h1>GitHub Activity Heatmap</h1>
      </header>
      <form onSubmit={handleSubmit} className="form-container">
        <input
          placeholder="Enter GitHub Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        ></input>
        <button type="submit">Submit</button>
      </form>
      <div className="heatmap-container">
        <h2>{`GitHub Activity Heatmap for ${username}`}</h2>
        {heatmapData && (
          <CalendarHeatmap
            startDate={new Date('2023-01-01')}
            endDate={new Date('2023-12-31')}
            values={heatmapData}
            classForValue={(value) => {
              if (!value) {
                return 'color-empty';
              }
              return `color-github-${value.count}`;
            }}
          />
        )}
      </div>
    </div>
  );
};

export default App;
