import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import './GameLobbyPage.css';

function GameLobbyPage() {
    const location = useLocation();
    const { gameCode, participants, wager } = location.state || {};
    const [prompt, setPrompt] = useState("");
    const navigate = useNavigate();
    const stompClient = useRef(null);

    function getShadeOfPurple(index, totalParticipants) {
        const hue = 260 + (30 * index / totalParticipants) % 30;
        const saturation = 50 + 10 * (index % 5);
        const lightness = 30 + 10 * (index % 7);
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    useEffect(() => {
        const socket = new SockJS('https://brainbet-2-0.onrender.com/ws', null, { transports: ['websocket'] });
        stompClient.current = Stomp.over(socket);
        stompClient.current.connect({}, () => {
            const gameStartTopic = `/topic/gameStart/${gameCode}`;
            sessionStorage.setItem('gameCode', gameCode);
            stompClient.current.subscribe(gameStartTopic, (message) => {
                const data = JSON.parse(message.body);
                const triviaData = data.questions;
                const wager = data.wager;
                navigate("/triviaGamePage", { state: { triviaData, wager } });
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
                prompt: prompt,
                wager: wager
            });
            stompClient.current.send("/app/startGame", {}, payload);
        }
    };

    return (
        <div className="center-image">
            <div className="image-overlay"></div>
            <div className="lobby-container">
                <div className="game-info">
                    <h1 className="lobby-title">Game Lobby</h1>
                    <div className="game-code">
                        <span className="label">Game Code:</span>
                        <span className="value">{gameCode}</span>
                    </div>
                    <div className="game-wager">
                        <span className="label">Wager:</span>
                        <span className="value">${wager}</span>
                    </div>
                </div>

                <div className="participants-section">
                    <h2 className="section-title">Players</h2>
                    <div className="participants-grid">
                        {participants && participants.map((participant, index) => (
                            <div key={index} className="participant-card">
                                <div className="participant-icon"
                                     style={{backgroundColor: getShadeOfPurple(index, participants.length)}}>
                                    {participant}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {isHost && (
                    <div className="host-controls">
                        <div className="prompt-section">
                            <h2 className="section-title">Game Settings</h2>
                            <input
                                type="text"
                                placeholder="Enter a topic for the trivia game..."
                                value={prompt}
                                onChange={handlePromptChange}
                                className="input-prompt"
                            />
                            <button 
                                onClick={handleStartGame} 
                                className="button-start-game"
                                disabled={!prompt.trim()}
                            >
                                Start Game
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GameLobbyPage;
