import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import logo from "../assets/logo.png";
import Axios from 'axios';
import { useNavigate } from "react-router-dom"; // ייבוא הניווט

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

const Login = () => {
    const [id, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // יצירת הפונקציה לניווט

    const mainColor = "#6A1B9A"; // סגול כהה

    const handleLogin = async () => {
        try {
            const response = await Axios.post(`http://localhost:1235/api/user/login`, {
                id,
                password
            });
            console.log("Login successful:", response.data);
            // כאן תוכלי להפנות לעמוד אחר או לשמור טוקן
        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
        }
    };

    const goToRegister = () => {
        navigate("/register"); // מעבר לעמוד register
    };

    return (
        <div className="flex flex-column justify-content-center align-items-center min-h-screen px-3 bg-white">
            <div className="mb-4">
                <img src={logo} alt="Logo" style={{ width: "120px" }} />
            </div>

            <div className="flex flex-wrap w-full md:w-10 lg:w-8 xl:w-7">
                <div className="w-full md:w-6 p-4 flex flex-column justify-content-center align-items-start">
                    <h3 className="mb-3 font-bold" style={{ color: mainColor }}>
                        Welcome to our platform
                    </h3>
                    <p style={{ color: mainColor }}>
                        Login to manage your cloud resources and services.
                    </p>

                    <div className="flex justify-content-center align-items-center mt-5 w-full">
                        <i className="pi pi-heart" style={{ fontSize: "3rem", color: mainColor }}></i>
                    </div>
                </div>

                <div className="hidden md:block" style={{ width: "1px", backgroundColor: mainColor, margin: "0 1rem" }}></div>

                <div className="w-full md:w-5 p-4">
                    <h2 className="mb-4" style={{ color: mainColor }}>Login</h2>

                    <div className="mb-3">
                        <label className="block font-bold mb-1" style={{ color: mainColor }}>Username</label>
                        <InputText
                            value={id}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="block font-bold mb-1" style={{ color: mainColor }}>Password</label>
                        <Password
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full"
                            feedback={false}
                            toggleMask
                            placeholder="Enter your password"
                            inputClassName="w-full"
                        />
                    </div>

                    <Button
                        label="Login"
                        onClick={handleLogin}
                        className="w-full mb-3"
                        style={{ backgroundColor: mainColor, borderColor: mainColor }}
                    />

                    <Divider align="center" className="my-3" style={{ color: mainColor }}>OR</Divider>

                    <Button
                        label="Register"
                        onClick={goToRegister}
                        className="w-full p-button-outlined"
                        style={{ color: mainColor, borderColor: mainColor }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;
