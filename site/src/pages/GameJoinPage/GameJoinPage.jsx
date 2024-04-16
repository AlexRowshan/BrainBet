
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
            // Remove the subscription to /topic/gameCreated from here
        });
    };

    const handleCreateGame = () => {
        if (stompClient.current) {
            const createGameRequest = {
                username: sessionStorage.getItem("username")
            };
            stompClient.current.send("/app/create", {}, JSON.stringify(createGameRequest));

            // Subscribe to game updates after sending the create game request
            const subscription = stompClient.current.subscribe('/topic/gameCreated', (gameCreated) => {
                const createdGameCode = gameCreated.body;
                setGameCode(createdGameCode);

                // Set the host status in the session storage
                sessionStorage.setItem("isHost", "true");

                // Navigate to the gameLobbyPage with the created game code
                navigate("/gameLobbyPage", { state: { gameCode: createdGameCode, username: sessionStorage.getItem("username") } });

                // Subscribe to game updates for the created game
                const gameUpdateTopic = `/topic/gameUpdate/${createdGameCode}`;
                stompClient.current.subscribe(gameUpdateTopic, (message) => {
                    const session = JSON.parse(message.body);
                    // Update the participants in the gameLobbyPage state
                    navigate("/gameLobbyPage", { state: { gameCode: session.gameCode, participants: Array.from(session.participants) } });
                });

                // Unsubscribe from the /topic/gameCreated topic
                subscription.unsubscribe();
            });
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
            <div className="center-image">
            <div className="content"></div>
                <div className="glass">
            {/*<div className="star-field">*/}
            {/*    <div className="layer"></div>*/}
            {/*    <div className="layer"></div>*/}
            {/*    <div className="layer"></div>*/}
            {/*</div>*/}
            <b>Hello {username}</b>
            <button type="button" className="button" onClick={handleCreateGame}>
                Create Game
            </button>
                    <div className="join-game-container">
                        <button type="button" className="button" onClick={handleJoinGame}>
                            Join Game
                        </button>
                        <input
                            type="text"
                            id="joinpagetextbox"
                            placeholder="Enter Game Code (ALL CAPS)"
                            value={gameCode}
                            onChange={handleGameCodeChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

}

export default GameJoinPage;