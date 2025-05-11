import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"

const HomePage = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);
    return (
        <>
            <h1>HomePage</h1>
        </>
    )
}

export default HomePage;

