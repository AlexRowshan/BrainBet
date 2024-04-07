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
                // i didn't do the backend for this
                navigate("/resultsPage", { state: { score } });
            }
        }
    }, [timer, currentQuestionIndex, triviaData.length, score, navigate]);

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
