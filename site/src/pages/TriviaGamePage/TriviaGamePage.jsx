import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import './TriviaGamePage.css';


function TriviaGamePage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { triviaData, wager } = location.state || {};
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(10);
    const [selectedAnswer, setSelectedAnswer] = useState(""); // Track the selected answer

    useEffect(() => {
        // Reset selected answer and timer for each question
        setSelectedAnswer("");
        setTimer(10);
        console.log("Current question index is " + currentQuestionIndex);

        const countdown = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer === 1) {
                    clearInterval(countdown); // Clear interval when timer is about to reach 0
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);

        return () => clearInterval(countdown);
    }, [currentQuestionIndex]);

    useEffect(() => {
        if (timer === 0) {
            const nextQuestionIndex = currentQuestionIndex + 1;
            if (nextQuestionIndex < triviaData.length) {
                setCurrentQuestionIndex(nextQuestionIndex);
            } else {
                const gameCode = sessionStorage.getItem('gameCode');
                const username = sessionStorage.getItem('username');
                const scoreData = {
                    gameCode: gameCode,
                    username: username,
                    score: score,
                };

                // Establish WebSocket connection and send game result data
                const socket = new SockJS('https://brainbet.onrender.com/ws');
                const stompClient = Stomp.over(socket);
                stompClient.connect({}, () => {
                    console.log('WebSocket connected in TriviaGamePage');
                    stompClient.send("/app/gameResult", {}, JSON.stringify(scoreData));
                    stompClient.disconnect(() => {
                        console.log('WebSocket disconnected in TriviaGamePage');
                        navigate("/gameLeaderboardPage", { state: { wager: wager } });
                    });
                });
            }
        }
    }, [timer]);

    const handleAnswerSelect = (option) => {
        setSelectedAnswer(option); // Mark the answer as selected
        const currentQuestion = triviaData[currentQuestionIndex];
        if (option === currentQuestion.correctAnswer) {
            setScore(score + 1); // Increment score for correct answer
        }
        // Optionally wait for the timer to expire to automatically move to the next question
    };

    if (!triviaData.length) {
        return <div>No trivia data found. Please start the game properly.</div>;
    }

    const currentQuestion = triviaData[currentQuestionIndex];

    return (
        <div className="center-image-trivia">
            <div>
                <h2>Trivia Game</h2>
                <p>Score: {score}</p>
                <p>Timer: {timer}</p>
                <p>Game Wager: {wager}</p>
                <p>Question Number: {currentQuestionIndex + 1} of {triviaData.length}</p>
                <div>
                    <p>{currentQuestion.question}</p>
                    <ul>
                        {currentQuestion.options.map((option, index) => (
                            <li key={index} style={{margin: '10px 0'}}>
                                <button
                                    onClick={() => handleAnswerSelect(option)}
                                    disabled={selectedAnswer !== ""}
                                    className={`button ${selectedAnswer === option ? (option === currentQuestion.correctAnswer ? 'correctAnswer' : 'wrongAnswer') : ''}`}
                                >
                                    {option}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default TriviaGamePage;

