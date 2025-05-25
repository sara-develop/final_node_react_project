import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './YearlySchedule.css'; // ייבוא עיצוב מותאם
import { HDate } from '@hebcal/core'; // ייבוא מחבילת @hebcal/core

const YearlySchedule = ({ classNumber }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateChange = (date) => {
        setSelectedDate(date);
        console.log('Selected date:', date);
    };

    // המרת תאריך גרגוריאני לעברי
    const hebrewDate = new HDate(selectedDate);

    return (
        <div className="yearly-schedule-container">
            <h2 className="yearly-schedule-title">
                Yearly Schedule for Class #{classNumber}
            </h2>
            <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                className="custom-calendar"
            />
            <p className="selected-date">
                Selected Date: {selectedDate.toDateString()}
            </p>
            <p className="hebrew-date">
                Hebrew Date: {`${hebrewDate.getDate()} ${hebrewDate.getMonthName()} ${hebrewDate.getFullYear()}`}
            </p>
        </div>
    );
};

export default YearlySchedule;

