import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      // Assuming you have a game code stored in sessionStorage
      const gameCode = sessionStorage.getItem('gameCode');
      const response = await axios.post(`/api/game/${gameCode}/score`, { userName: '', userScore: 0 });
      setLeaderboardData(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    }
  };


  return (
    <div>
      <h2>Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((participant, index) => (
            <tr key={participant.id}>
              <td>{index + 1}</td>
              <td>{participant.name}</td>
              <td>{participant.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeaderboardPage;