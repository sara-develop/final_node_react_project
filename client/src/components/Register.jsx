import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import logo from "../assets/logo.png";
import Axios from "axios";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

const Register = () => {
    const [name, setName] = useState("");
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");

    const mainColor = "#6A1B9A"; // סגול כהה

    const handleRegister = async () => {
        try {
            const response = await Axios.post("http://localhost:1235/api/user/register", {
                name,
                id,
                password,
            });
            console.log("Register successful:", response.data);
            // תוכלי להפנות לעמוד התחברות או להתחבר אוטומטית
        } catch (error) {
            console.error("Registration failed:", error.response?.data || error.message);
        }
    };

    return (
        <div className="flex flex-column justify-content-center align-items-center min-h-screen px-3 bg-white">
            <div className="mb-4">
                <img src={logo} alt="Logo" style={{ width: "120px" }} />
            </div>

            <div className="flex flex-wrap w-full md:w-10 lg:w-8 xl:w-7">
                <div className="w-full md:w-6 p-4 flex flex-column justify-content-center align-items-start">
                    <h3 className="mb-3 font-bold" style={{ color: mainColor }}>
                        Join our platform
                    </h3>
                    <p style={{ color: mainColor }}>
                        Register to start managing your cloud resources and services.
                    </p>

                    <div className="flex justify-content-center align-items-center mt-5 w-full">
                        <i className="pi pi-user-plus" style={{ fontSize: "3rem", color: mainColor }}></i>
                    </div>
                </div>

                <div className="hidden md:block" style={{ width: "1px", backgroundColor: mainColor, margin: "0 1rem" }}></div>

                <div className="w-full md:w-5 p-4">
                    <h2 className="mb-4" style={{ color: mainColor }}>Register</h2>

                    <div className="mb-3">
                        <label className="block font-bold mb-1" style={{ color: mainColor }}>Name</label>
                        <InputText
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full"
                            placeholder="Enter your name"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="block font-bold mb-1" style={{ color: mainColor }}>ID</label>
                        <InputText
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className="w-full"
                            placeholder="Enter your ID"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-bold mb-1" style={{ color: mainColor }}>Password</label>
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
                        style={{ backgroundColor: mainColor, borderColor: mainColor }}
                    />

                    <Divider align="center" className="my-3" style={{ color: mainColor }}>OR</Divider>

                    <a href="/login">
                        <Button
                            label="Back to Login"
                            className="w-full p-button-outlined"
                            style={{ color: mainColor, borderColor: mainColor }}
                        />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Register;
