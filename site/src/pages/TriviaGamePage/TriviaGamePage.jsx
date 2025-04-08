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
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

    useEffect(() => {
        setSelectedAnswer("");
        setShowCorrectAnswer(false);
        setTimer(10);

        const countdown = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer === 1) {
                    clearInterval(countdown);
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);

        return () => clearInterval(countdown);
    }, [currentQuestionIndex]);

    useEffect(() => {
        if (timer === 0) {
            setShowCorrectAnswer(true);
            const nextQuestionIndex = currentQuestionIndex + 1;
            if (nextQuestionIndex < triviaData.length) {
                setTimeout(() => {
                    setCurrentQuestionIndex(nextQuestionIndex);
                }, 2000);
            } else {
                const gameCode = sessionStorage.getItem('gameCode');
                const username = sessionStorage.getItem('username');
                const scoreData = {
                    gameCode: gameCode,
                    username: username,
                    score: score,
                };

                const socket = new SockJS('http://localhost:8080/ws');
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
        if (selectedAnswer) return; // Prevent multiple selections
        setSelectedAnswer(option);
        setShowCorrectAnswer(true);
        const currentQuestion = triviaData[currentQuestionIndex];
        if (option === currentQuestion.correctAnswer) {
            setScore(score + 1);
        }
    };

    if (!triviaData || !triviaData.length) {
        return <div className="error-message">No trivia data found. Please start the game properly.</div>;
    }

    const currentQuestion = triviaData[currentQuestionIndex];

    return (
        <div className="trivia-container">
            <div className="game-header">
                <div className="game-stats">
                    <div className="stat-box">
                        <span className="stat-label">Score</span>
                        <span className="stat-value">{score}</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-label">Timer</span>
                        <span className="stat-value">{timer}s</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-label">Wager</span>
                        <span className="stat-value">${wager}</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-label">Question</span>
                        <span className="stat-value">{currentQuestionIndex + 1}/{triviaData.length}</span>
                    </div>
                </div>
            </div>

            <div className="question-container">
                <h2 className="question-text">{currentQuestion.question}</h2>
                <div className="options-container">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswerSelect(option)}
                            disabled={selectedAnswer !== ""}
                            className={`option-button ${
                                selectedAnswer === option
                                    ? option === currentQuestion.correctAnswer
                                        ? 'correct'
                                        : 'incorrect'
                                    : showCorrectAnswer && option === currentQuestion.correctAnswer
                                        ? 'correct-answer'
                                        : ''
                            }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
                {showCorrectAnswer && (
                    <div className="answer-feedback">
                        {selectedAnswer === currentQuestion.correctAnswer
                            ? "Correct! 🎉"
                            : `Incorrect. The correct answer was: ${currentQuestion.correctAnswer}`}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TriviaGamePage;

