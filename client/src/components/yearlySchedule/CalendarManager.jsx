import React, { useState, useEffect } from 'react';
import axios from 'axios';
import YearlySchedule from './YearlySchedule';
import './CalendarManager.css';

const CalendarManager = () => {
    const [classNumber, setClassNumber] = useState('');
    const [allClasses, setAllClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:1235/api/student/getAllClasses', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                setAllClasses(response.data.map(Number));
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch class numbers', err);
                setLoading(false);
            });
    }, []);

    const handleClassChange = (event) => {
        setClassNumber(event.target.value);
    };

    if (loading) {
        return <div className="calendar-loading">Loading classes...</div>;
    }

    return (
        <div className="schedule-management-container">
            <h2 className="schedule-title">
                Yearly Calender Class #{classNumber && `${classNumber}`}
            </h2>

            <div className="select-class-container">
                <label htmlFor="classNumber" className="select-label">Select Class Number: </label>
                <select
                    id="classNumber"
                    value={classNumber}
                    onChange={handleClassChange}
                    className="class-dropdown"
                >
                    <option value="">Select a class</option>
                    {allClasses.map((classNum) => (
                        <option key={classNum} value={classNum}>
                            {classNum}
                        </option>
                    ))}
                </select>
            </div>

            {classNumber && (
                <div className="schedule-table-wrapper">
                    <YearlySchedule classNumber={classNumber} />
                </div>
            )}
        </div>
    );
};

export default CalendarManager;