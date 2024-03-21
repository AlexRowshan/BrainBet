import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import "./GameJoinPage.css";


function GameJoinPage() {
    const [username, setUsername] = useState("");
    const [gameCode, setGameCode] = useState("");
    const navigate = useNavigate();
    // Use useRef instead of a regular variable
    const stompClient = useRef(null);

    useEffect(() => {
        const storedUsername = sessionStorage.getItem("username");
        setUsername(storedUsername);
        connect();
    }, []);

    const connect = () => {
        const socket = new SockJS('http://localhost:8080/ws');
        // Assign to current property of the ref
        stompClient.current = Stomp.over(socket);
        stompClient.current.connect({}, frame => {
            stompClient.current.subscribe('/topic/gameCreated', (gameCreated) => {
                setGameCode(gameCreated.body);
                navigate("/gameLobbyPage", { state: { gameCode: gameCreated.body, username: sessionStorage.getItem("username") } });
            });
        });
    };

    const handleCreateGame = () => {
        if (stompClient.current) {
            const createGameRequest = {
                username: sessionStorage.getItem("username")
            };
            stompClient.current.send("/app/create", {}, JSON.stringify(createGameRequest));
        }
    };

    const handleGameCodeChange = (event) => {
        setGameCode(event.target.value);
    };

    const handleJoinGame = () => {
        if (stompClient.current && gameCode) {
            stompClient.current.send("/app/join", {}, JSON.stringify({ gameCode, username: sessionStorage.getItem("username") }));
            // Subscribe to game updates
            const gameUpdateTopic = `/topic/gameUpdate/${gameCode}`;
            stompClient.current.subscribe(gameUpdateTopic, (message) => {
                const session = JSON.parse(message.body);
                navigate("/gameLobbyPage", { state: { gameCode: session.gameCode, participants: Array.from(session.participants) } });
            });
        }
    };


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