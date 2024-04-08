import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function gameLobbyPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();


    const handleSubmit = (e) => {
        e.preventDefault();
        let validForm = true;

        // Username validation
        if (username.trim() === '') {
            setUsernameError('Username cannot be empty.');
            validForm = false;
        } else {
            setUsernameError('');
        }

        // Password validation
        if (password.trim() === '') {
            setPasswordError('Password cannot be empty.');
            validForm = false;
        } else {
            setPasswordError('');
        }

        if (validForm) {
            fetch("/LogIn", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            .then((response) => response.json())
            .then((response) => {
                if (response.message === "Incorrect username or password") {
                    setUsernameError('Incorrect username or password');
                } else if (response.message === "login successful") {
                    //setFetchResponse(response.data);
                    console.log("login successful")
                    navigate('/national-park-search');
                }
//                 else  {
//                 console.log("we are in the last else ")
//                 }
            })
            .catch((error) => {
                console.error("Error:", error);
                setUsernameError("An API error occured")
            });
        };
    }

    return (
        <div className="container">

        </div>
    );
}

export default gameLobbyPage;