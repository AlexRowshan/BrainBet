import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

function GameLeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState([]);
    const stompClient = useRef(null);

    useEffect(() => {
        const gameCode = sessionStorage.getItem('gameCode');
        const socket = new SockJS('http://localhost:8080/ws');
        stompClient.current = Stomp.over(socket);
        stompClient.current.connect({}, () => {
            console.log('WebSocket connected');
            const leaderboardTopic = `/topic/leaderboard/${gameCode}`;
            stompClient.current.subscribe(leaderboardTopic, (message) => {
                console.log('I am here');
                const scoreData = JSON.parse(message.body);
                console.log('Received score data:', scoreData);
                setLeaderboard((prevLeaderboard) => {
                    const newLeaderboard = [...prevLeaderboard, scoreData];
                    newLeaderboard.sort((a, b) => b.score - a.score);
                    return newLeaderboard;
                });
            }, (error) => {
                console.error('WebSocket subscription error:', error);
            });
        }, (error) => {
            console.error('WebSocket connection error:', error);
        });

        return () => {
            if (stompClient.current) {
                stompClient.current.disconnect();
                console.log('WebSocket disconnected');
            }
        };
    }, []);

    const calculatePrizeDistribution = (leaderboard) => {
        const prizes = [50, 30, 20]; // Prizes for 1st, 2nd, and 3rd
        const distribution = new Array(leaderboard.length).fill(0); // Start with 0% for everyone
        let currentPrizeIndex = 0; // Start with the top prize

        // Create a structure to hold groups of same scores
        const scoreGroups = leaderboard.reduce((acc, curr) => {
            if (acc.length === 0 || acc[acc.length - 1].score !== curr.score) {
                acc.push({ score: curr.score, users: [curr], prizeIndex: currentPrizeIndex });
                currentPrizeIndex++; // Move to the next prize
            } else {
                acc[acc.length - 1].users.push(curr);
            }
            return acc;
        }, []);

        // Now distribute the prizes for each group
        scoreGroups.forEach(group => {
            if (group.prizeIndex < 3) { // Only distribute if within the top 3 prizes
                const totalPrizeForGroup = group.users.length > 1
                    ? prizes.slice(group.prizeIndex, group.prizeIndex + group.users.length).reduce((a, b) => a + b, 0)
                    : prizes[group.prizeIndex];
                const prizePerUser = totalPrizeForGroup / group.users.length;
                group.users.forEach(user => {
                    const userIndex = leaderboard.findIndex(u => u.username === user.username);
                    distribution[userIndex] = prizePerUser;
                });
            }
        });

        return distribution;
    };


    const prizeDistribution = calculatePrizeDistribution(leaderboard);

    return (
        <div>
            <h2>Leaderboard</h2>
            <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                {leaderboard.map(({ username, score }, index) => (
                    <li key={username}>
                        {index + 1}. {username} - {score} points {prizeDistribution[index]}%
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default GameLeaderboardPage;