import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the leaderboard data from the backend
    fetch('/api/leaderboard')
      .then(response => response.json())
      .then(data => setLeaderboard(data))
      .catch(error => console.error('Error fetching leaderboard:', error));
  }, []);

  const handleBackToGame = () => {
    navigate('/gameJoinPage');
  };

  return (
    <div>hi</div>
  );
};

export default LeaderboardPage;