import React from "react";
import { useLocation } from "react-router-dom";

function GameLobbyPage() {
    const location = useLocation();
    const { gameCode, participants } = location.state || {};

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
        </div>
    );
}

export default GameLobbyPage;
