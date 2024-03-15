import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import "./GameJoinPage.css";

function GameJoinPage() {
    const [username, setUsername] = useState("");
    const [balance, setBalance] = useState(0);
    const [gameCode, setGameCode] = useState("");
    const navigate = useNavigate();
    const socket = io("http://localhost:8080");

    useEffect(() => {
        const storedUsername = sessionStorage.getItem("username");
        setUsername(storedUsername);
    }, []);

    const fetchUserBalance = () => {
        fetch("/balance")
            .then((response) => response.text())
            .then((data) => {
                const balance = parseFloat(data);
                setBalance(balance);
            })
            .catch((error) => {
                console.error("Error fetching user balance:", error);
            });
    };

    const handleGameCodeChange = (event) => {
        setGameCode(event.target.value);
    };

    const handleCreateGame = () => {
        socket.emit("createGame", username, (response) => {
            if (response.success) {
                const gameCode = response.gameCode;
                sessionStorage.setItem("gameCode", gameCode);
                navigate("/gameLobbyPage");
            } else {
                alert("Unable to connect");
            }
        });
    };

    const handleJoinGame = () => {
        socket.emit("joinGame", { gameCode, username }, (response) => {
            if (response.success) {
                sessionStorage.setItem("gameCode", gameCode);
                navigate("/lobby");
            } else {
                alert("Unable to join");
            }
        });
    };

    return (
        <div>
            <div className="bg"></div>
            <div className="star-field">
                <div className="layer"></div>
                <div className="layer"></div>
                <div className="layer"></div>
            </div>
                <b>Hello {username}</b>
                <button type="button" className="button" onClick={handleCreateGame}>
                    Create Game
                </button>
                <div className="join-game-container">
                    <input
                        type="text"
                        placeholder="Enter Game Code"
                        value={gameCode}
                        onChange={handleGameCodeChange}
                    />
                    <button type="button" className="button" onClick={handleJoinGame}>
                        Join Game
                    </button>
                </div>
        </div>
);
}

export default GameJoinPage;