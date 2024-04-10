// GameLeaderboardPage.js
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
                setLeaderboard((prevLeaderboard) => [...prevLeaderboard, scoreData]);
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

    return (
        <div>
            <h2>Leaderboard</h2>
            <ul>
                {leaderboard.map((entry, index) => (
                    <li key={index}>
                        {entry.username}: {entry.score}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default GameLeaderboardPage;