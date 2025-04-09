import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useLocation, useNavigate } from 'react-router-dom';
import './GameLeaderboardPage.css';
import leaderboardImage from './leaderboardTitle.png';

function GameLeaderboardPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [leaderboard, setLeaderboard] = useState([]);
    const [prizeDistribution, setPrizeDistribution] = useState([]);
    const stompClient = useRef(null);
    const { wager } = location.state || {};

    useEffect(() => {
        console.log("Game wager:", wager);
        const gameCode = sessionStorage.getItem('gameCode');
        const socket = new SockJS('https://brainbet-2-0.onrender.com/ws');
        stompClient.current = Stomp.over(socket);
        stompClient.current.connect({}, () => {
            console.log('WebSocket connected');
            const leaderboardTopic = `/topic/leaderboard/${gameCode}`;
            stompClient.current.subscribe(leaderboardTopic, (message) => {
                const scoreData = JSON.parse(message.body);
                setLeaderboard((prevLeaderboard) => {
                    const newLeaderboard = [...prevLeaderboard, scoreData];
                    newLeaderboard.sort((a, b) => b.score - a.score);
                    const prizeDistribution = calculatePrizeDistribution(newLeaderboard, wager);
                    setPrizeDistribution(prizeDistribution);
                    fetchAndUpdateBalances(newLeaderboard, prizeDistribution);
                    return newLeaderboard;
                });
            });
        });

        return () => {
            if (stompClient.current) {
                stompClient.current.disconnect();
                console.log('WebSocket disconnected');
            }
        };
    }, []);

    const calculatePrizeDistribution = (leaderboard) => {
        const prizes = [50, 30, 20]; // Percentage for 1st, 2nd, and 3rd
        const totalWager = wager * leaderboard.length; // Total wager
        const distribution = new Array(leaderboard.length).fill(0); // Start with 0 for everyone

        // Group by score
        const scoreGroups = leaderboard.reduce((acc, curr) => {
            let group = acc.find(g => g.score === curr.score);
            if (!group) {
                group = { score: curr.score, users: [] };
                acc.push(group);
            }
            group.users.push(curr);
            return acc;
        }, []);

        // Sort groups by score descending
        scoreGroups.sort((a, b) => b.score - a.score);

        // Allocate prizes based on groups
        let prizeIndex = 0;
        scoreGroups.forEach(group => {
            if (prizeIndex >= prizes.length) return; // No more prizes to distribute

            // Calculate the sum of prizes for the number of tied positions
            const prizeSum = prizes.slice(prizeIndex, prizeIndex + group.users.length)
                .reduce((sum, prize) => sum + prize, 0);
            const totalPrizeForGroup = totalWager * (prizeSum / 100);
            const prizePerUser = totalPrizeForGroup / group.users.length;

            // Assign the prize to each user in this group
            group.users.forEach(user => {
                const index = leaderboard.findIndex(u => u.username === user.username);
                distribution[index] = prizePerUser;
            });

            // Move the prizeIndex by the number of users in the group
            prizeIndex += group.users.length;
        });

        return distribution;
    };

    const fetchAndUpdateBalances = async (leaderboard, distribution) => {
        const updatedLeaderboard = await Promise.all(leaderboard.map(async (user, index) => {
            const response = await fetch('/balance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: user.username })
            });
            const currentBalance = await response.json();
            const newBalance = currentBalance + distribution[index];
            return { ...user, balance: newBalance };
        }));
        setLeaderboard(updatedLeaderboard);
    };

    const handleBackToLobby = () => {
        navigate('/GameJoinPage');
    };

    return (
        <div className="center-image">
            <div className="image-overlay"></div>
            <div className="leaderboard-container">
                <img
                    src={leaderboardImage}
                    alt="Leaderboard"
                    className="leaderboard-title"
                />
                <div className="game-info">
                    <h2 className="total-wager">Total Game Wager: ${wager * leaderboard.length}</h2>
                </div>
                <div className="leaderboard-content">
                    <div className="leaderboard-header">
                        <span className="rank">Rank</span>
                        <span className="player">Player</span>
                        <span className="score">Score</span>
                        <span className="prize">Prize</span>
                        <span className="balance">Balance</span>
                    </div>
                    <ul className="leaderboard-list">
                        {leaderboard.map(({ username, score, balance }, index) => (
                            <li key={username} className={`leaderboard-item ${index < 3 ? `rank-${index + 1}` : ''}`}>
                                <span className="rank">{index + 1}</span>
                                <span className="player">{username}</span>
                                <span className="score">{score} pts</span>
                                <span className="prize">${prizeDistribution[index].toFixed(2)}</span>
                                <span className="balance">${(balance - wager).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <button
                    onClick={handleBackToLobby}
                    className="back-to-lobby-button"
                >
                    Back to Lobby
                </button>
            </div>
        </div>
    );
}

export default GameLeaderboardPage;