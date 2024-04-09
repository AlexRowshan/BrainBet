import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function TriviaGamePage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { triviaData } = location.state || {};
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
                // Fetch, send score, username, game code, sort in backend
                const gameCode = sessionStorage.getItem('gameCode');
                console.log(gameCode);
                const userName = sessionStorage.getItem('username');
                console.log(userName);
                const userScore = score;
                console.log(userScore);

                fetch(`/api/game/${gameCode}/score`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userName, userScore }),
                })
                .then((response) => response.json())
                .then((data) => {
                    // Handle the response from the backend
                    console.log('Leaderboard data:', data);
                    navigate("/gameLeaderboardPage", { state: { score } });
                })
                .catch((error) => {
                    console.error('Error submitting score:', error);
                    navigate("/gameLeaderboardPage", { state: { score } });
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
        <div>
            <h2>Trivia Game</h2>
            <p>Score: {score}</p>
            <p>Timer: {timer}</p>
            <div>
                <p>{currentQuestion.question}</p>
                <ul>
                    {currentQuestion.options.map((option, index) => (
                        <li key={index} style={{ margin: '10px 0' }}>
                            <button
                                onClick={() => handleAnswerSelect(option)}
                                disabled={selectedAnswer !== ""} // Disable the button if an answer has been selected
                                style={{
                                    backgroundColor: selectedAnswer === option ? (option === currentQuestion.correctAnswer ? 'green' : 'red') : '',
                                    color: 'white',
                                }}
                            >
                                {option}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default TriviaGamePage;
