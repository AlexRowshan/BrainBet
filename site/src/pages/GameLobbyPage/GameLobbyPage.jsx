import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

function GameLobbyPage() {
    const location = useLocation();
    const { gameCode, participants } = location.state || {};
    const [prompt, setPrompt] = useState("");
    const navigate = useNavigate();
    const stompClient = useRef(null);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        stompClient.current = Stomp.over(socket);
        stompClient.current.connect({}, () => {
            const gameStartTopic = `/topic/gameStart/${gameCode}`;
            sessionStorage.setItem('gameCode', gameCode);
            stompClient.current.subscribe(gameStartTopic, (message) => {
                const triviaData = JSON.parse(message.body);
                navigate("/triviaGamePage", { state: { triviaData } });
            });
        });

        return () => {
            if (stompClient.current) {
                stompClient.current.disconnect();
            }
        };
    }, [gameCode, navigate]);

    const isHost = sessionStorage.getItem("isHost") === "true";

    const handlePromptChange = (event) => {
        setPrompt(event.target.value);
    };

    const handleStartGame = () => {
        if (stompClient.current) {
            const payload = JSON.stringify({
                gameCode: gameCode,
                prompt: prompt
            });
            stompClient.current.send("/app/startGame", {}, payload);
        }
    };

    return (
        <div>
            <h2>Game Lobby</h2>
            {gameCode && <p>Game Code: {gameCode}</p>}
            <h3>Participants:</h3>
            <ul>
                {participants && participants.map((participant, index) => (
                    <li key={index}>{participant}</li>
                ))}
            </ul>
            {isHost && (
                <div>
                    <input
                        type="text"
                        placeholder="Enter a prompt"
                        value={prompt}
                        onChange={handlePromptChange}
                    />
                    <button onClick={handleStartGame}>Start Game</button>
                </div>
            )}
        </div>
    );
}

export default GameLobbyPage;