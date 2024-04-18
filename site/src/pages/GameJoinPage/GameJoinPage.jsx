
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
    const [wager, setWager] = useState(0);
    const [selectedWager, setSelectedWager] = useState(0);

    useEffect(() => {
        const storedUsername = sessionStorage.getItem("username");
        setUsername(storedUsername);
        fetchUserBalance();
        connect();
    }, []);

    useEffect(() => {
        if (wager > 0) {
            const interval = setInterval(() => {
                setSelectedWager((prevSelectedWager) => {
                    if (prevSelectedWager < wager) {
                        return prevSelectedWager + 1;
                    } else {
                        clearInterval(interval);
                        return wager;
                    }
                });
            }, 5);
            return () => clearInterval(interval);
        }
    }, [wager]);

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
                username: sessionStorage.getItem("username"),
                wager: selectedWager
            };
            stompClient.current.send("/app/create", {}, JSON.stringify(createGameRequest));

            // Subscribe to game updates after sending the create game request
            const subscription = stompClient.current.subscribe('/topic/gameCreated', (gameCreated) => {
                const createdGameCode = gameCreated.body;
                setGameCode(createdGameCode);

                // Set the host status in the session storage
                sessionStorage.setItem("isHost", "true");

                // Navigate to the gameLobbyPage with the created game code
                navigate("/gameLobbyPage", { state: { gameCode: createdGameCode, username: sessionStorage.getItem("username"), wager: selectedWager } });

                // Subscribe to game updates for the created game
                const gameUpdateTopic = `/topic/gameUpdate/${createdGameCode}`;
                stompClient.current.subscribe(gameUpdateTopic, (message) => {
                    const session = JSON.parse(message.body);
                    // Update the participants in the gameLobbyPage state
                    navigate("/gameLobbyPage", { state: { gameCode: session.gameCode, participants: Array.from(session.participants), wager: selectedWager } });
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
        let error = false;
        if (stompClient.current && gameCode) {
            // Send join request

            stompClient.current.send("/app/join", {}, JSON.stringify({ gameCode, username: sessionStorage.getItem("username") }));

            const gameUpdateTopic = `/topic/gameUpdate/${gameCode}`;
            let error = false;
            const gameUpdateSubscription = stompClient.current.subscribe(gameUpdateTopic, (message) => {
                console.log("Received a game update");

                if (message.body === "{\"error\": \"Not enough coin!\"}") {
                    error = true;
                    gameUpdateSubscription.unsubscribe();
                    alert("Not enough coin!");

                }
                 else {
                    const session = JSON.parse(message.body);
                    console.log("Navigating to game lobby page");

                    // Check if session.participants exists before converting to an array
                    const participants = session.participants ? Array.from(session.participants) : [];

                    navigate("/gameLobbyPage", { state: { gameCode: session.gameCode, participants } });
                    gameUpdateSubscription.unsubscribe();
                }
            });

            console.log("Error is " + error);

        }

    };



    const fetchUserBalance = () => {
        const username = sessionStorage.getItem("username"); // Get the username from session storage
        fetch('/balance', {
            method: 'POST', // Corrected to POST since you are sending a body
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }) // Sending username as an object
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setWager(data); // Make sure you have defined setWager
            })
            .catch(error => {
                console.error("Error fetching wager amount:", error);
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
                    <b>Current Balance: ${wager}</b>
                    <div className="wager-slider-container">
                        <label htmlFor="wager-slider">Choose your wager: ${selectedWager}</label>
                        <input
                            type="range"
                            id="wager-slider"
                            className="wager-slider"
                            min="0"
                            max={wager} // Maximum should be the user's balance
                            value={selectedWager}
                            onChange={(e) => setSelectedWager(Number(e.target.value))}
                        />
                    </div>
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