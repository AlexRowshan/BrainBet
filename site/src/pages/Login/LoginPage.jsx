import React, {useState} from "react";
import { useNavigate } from 'react-router-dom';
import  './LoginPage.css'
import brainCouchImage from './BrainCouch.png';
import person from './person.png';
import password from './password.png';
function LoginPage() {

    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSignUpClick = (event) => {
        event.preventDefault();
        fetch("/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.text())
            .then(data => {
                if(data === "success"){
                    const { username } = formData;
                    sessionStorage.setItem('username', username);

                    navigate("/gameJoinPage");
                } else{
                    alert("Signup was unsuccessful.");
                }

            });



    };

    // Define the click handler for the Login button
    const handleLoginClick = (event) => {
        event.preventDefault();
        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.text())
            .then(data => {
                if(data === "success"){

                    const { username } = formData;
                    sessionStorage.setItem('username', username);
                    navigate("/gameJoinPage");
                } else{
                    alert("Login was unsuccessful.");
                }
            });

    };


    return (
        <>
            <div className="bg"></div>
            <div className="star-field">
                <div className="layer"></div>
                <div className="layer"></div>
                <div className="layer"></div>
            </div>
            <div className="box">
                <img src={brainCouchImage} alt="Brain Couch" width="300" height="200"/>
                <div> {/* Wrapper div for text, optional depending on desired spacing */}
                    <span>B</span>
                    <span>r</span>
                    <span>a</span>
                    <span>i</span>
                    <span>n</span>
                    <span> </span>
                    <span>B</span>
                    <span>e</span>
                    <span>t</span>
                </div>
                <div className="container">
                    <div className="header">
                        <div className="text">Sign Up</div>
                        <div className="underline"></div>
                    </div>
                    <div className="inputs">
                        <div className="input">
                            <img src={person} alt="person"/>
                            <input type="text" name="username" value={formData.username} onChange={handleChange}
                                   placeholder="Username"/>
                        </div>
                        <div className="input">
                            <img src={password} alt="password"/>
                            <input type="password" name="password" value={formData.password} onChange={handleChange}
                                   placeholder="Password"/>
                        </div>
                        <div className="submit-container">
                            <div className="submit" onClick={handleSignUpClick}>Sign Up</div>
                            <div className="submit" onClick={handleLoginClick}>Login</div>
                        </div>
                    </div>
                </div>

            </div>
        </>

    );
}

export default LoginPage;