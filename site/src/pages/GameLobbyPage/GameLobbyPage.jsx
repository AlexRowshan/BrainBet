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
        const hue = 260 + (30 * index / totalParticipants) % 30; // Keeping hue within a tighter purple range
        const saturation = 50 + 10 * (index % 5); // Subtle changes in saturation
        const lightness = 30 + 10 * (index % 7); // More subtle gradient in lightness
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }


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
        <div className="center-image">
            <div className="image-overlay"></div>
            <div>
                <h2>Game Lobby</h2>
                {gameCode && <p>Game Code: {gameCode}</p>}
                <h3>Participants:</h3>
                <ul>
                    {participants && participants.map((participant, index) => (
                        <li key={index}>
                            <div className="participant-icon"
                                 style={{backgroundColor: getShadeOfPurple(index, participants.length)}}>
                                {participant}
                            </div>
                        </li>
                    ))}
                </ul>


                {isHost && (
                    <div>
                        <input
                            type="text"
                            placeholder="Enter a prompt"
                            value={prompt}
                            onChange={handlePromptChange}
                            className="input-prompt"
                        />
                        <button onClick={handleStartGame} className="button-start-game">Start Game</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GameLobbyPage;