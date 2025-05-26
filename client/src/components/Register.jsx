import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux'; // לקריאת מידע מה־Redux store
import Axios from "axios";

import logo from "../assets/logo.png";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

const Register = () => {
    const [name, setName] = useState("");
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const gray = "#58585a";
    const purple = "#542468";

    const token = useSelector(state => state.user.token)  // קריאת שם המשתמש מה־Redux, או ברירת מחדל

    const handleRegister = async () => {
        //const token = localStorage.getItem("accessToken"); // השגת הטוקן

        if (!token) {
            setError("You must be logged in as admin to register a new user.");
            return;
        }

        const data = { name, id, password };

        try {
            const response = await Axios.post(
                "http://localhost:1235/api/user/register",
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Register successful:", response.data);
            navigate("/Homepage"); // ניווט לעמוד הבית לאחר רישום מוצלח
        } catch (error) {
            console.error("Registration failed:", error.response?.data || error.message);
            setError(
                error.response?.data?.message || "Registration failed. Please try again."
            );
        }
    };

    return (
        <div className="flex flex-column justify-content-center align-items-center min-h-screen px-3 bg-white">
            <div className="mb-4">
                <img src={logo} alt="Logo" style={{ width: "120px" }} />
            </div>

            <div className="flex flex-wrap w-full md:w-10 lg:w-8 xl:w-7">
                <div className="w-full md:w-6 p-4 flex flex-column justify-content-center align-items-start">
                    <h3 className="mb-3 font-bold" style={{ color: purple }}>
                        Join our platform
                    </h3>
                    <p style={{ color: purple }}>
                        Register to start managing your cloud resources and services.
                    </p>

                    <div className="flex justify-content-center align-items-center mt-5 w-full">
                        <i
                            className="pi pi-user-plus"
                            style={{ fontSize: "3rem", color: purple }}
                        ></i>
                    </div>
                </div>

                <div
                    className="hidden md:block"
                    style={{ width: "1px", backgroundColor: purple, margin: "0 1rem" }}
                ></div>

                <div className="w-full md:w-5 p-4">
                    <h2 className="mb-4" style={{ color: purple }}>
                        Register
                    </h2>

                    {error && (
                        <div
                            style={{
                                marginBottom: "1rem",
                                color: "red",
                                fontWeight: "bold",
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="block font-bold mb-1" style={{ color: gray }}>
                            Name
                        </label>
                        <InputText
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full"
                            placeholder="Enter your name"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="block font-bold mb-1" style={{ color: gray }}>
                            ID
                        </label>
                        <InputText
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className="w-full"
                            placeholder="Enter your ID"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-bold mb-1" style={{ color: purple }}>
                            Password
                        </label>
                        <Password
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full"
                            feedback={false}
                            toggleMask
                            placeholder="Create a password"
                            inputClassName="w-full"
                        />
                    </div>

                    <Button
                        label="Register"
                        onClick={handleRegister}
                        className="w-full"
                        style={{ backgroundColor: purple, borderColor: purple }}
                    />

                    <Divider align="center" className="my-3" style={{ color: purple }}>
                        OR
                    </Divider>

                    {/* כאן אפשר להוסיף קישור חזרה לעמוד כניסה אם רוצים */}
                </div>
            </div>
        </div>
    );
};

export default Register;
