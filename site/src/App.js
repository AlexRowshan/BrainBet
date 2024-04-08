import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage";
import GameJoinPage from "./pages/GameJoinPage/GameJoinPage";
import GameLobbyPage from "./pages/GameLobbyPage/GameLobbyPage";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/gameJoinPage" element={<GameJoinPage />} />
                <Route path="/gameLobbyPage" element={<GameLobbyPage />} />
                <Route path="/gameLeaderboardPage" element={<gameLeaderboardPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    )
}

export default App;

