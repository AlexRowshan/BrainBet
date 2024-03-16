import React from "react";
import { useLocation } from "react-router-dom";

function GameLobbyPage() {
    const location = useLocation();
    const { gameCode, username } = location.state || {}; // Default to an empty object if state is undefined

    return (
        <div>
            <h2>Game Lobby</h2>
            {gameCode && <p>Game Code: {gameCode}</p>}
            {username && <p>Host: {username}</p>}
        </div>
    );
}

export default GameLobbyPage;