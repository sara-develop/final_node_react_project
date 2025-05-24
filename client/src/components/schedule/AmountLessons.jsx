import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import axios from 'axios';

const AmountLessons = ({ classNumber, onScheduleUpdated }) => {
    const [lessonsPerDay, setLessonsPerDay] = useState({
        sunday: 0, monday: 0, tuesday: 0, wednesday: 0, thursday: 0
    });
    const [scheduleExists, setScheduleExists] = useState(false);
    const [loading, setLoading] = useState(true);

    // ימים בעברית
    const days = [
        { key: 'sunday', label: 'ראשון' },
        { key: 'monday', label: 'שני' },
        { key: 'tuesday', label: 'שלישי' },
        { key: 'wednesday', label: 'רביעי' },
        { key: 'thursday', label: 'חמישי' },
    ];

    // שליפת מערכת שעות קיימת
    useEffect(() => {
        if (!classNumber) return;
        setLoading(true);
        axios.get(`http://localhost:1235/api/schedule/getScheduleByClassNumber/${classNumber}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => {
                setScheduleExists(true);
                // קבע את מספר השיעורים לפי המערכת הקיימת
                const newLessonsPerDay = {};
                days.forEach(day => {
                    newLessonsPerDay[day.key] = res.data[day.key]?.lessons?.length || 0;
                });
                setLessonsPerDay(newLessonsPerDay);
            })
            .catch(err => {
                if (err.response?.data?.message === "Schedule not found") {
                    setScheduleExists(false);
                }
            })
            .finally(() => setLoading(false));
    }, [classNumber]);

    // עדכון/יצירת מערכת שעות
    const handleSave = async () => {
        setLoading(true);
        console.log('נשלח לשרת:', { classNumber, lessonsPerDay });
        try {
            const res = await axios.post(
                'http://localhost:1235/api/schedule/updateLessonsAmount',
                {
                    classNumber,
                    lessonsPerDay
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );
            console.log('תגובה מהשרת:', res.data);
            setScheduleExists(true);
            setLoading(false);
            if (onScheduleUpdated) onScheduleUpdated();
        } catch (err) {
            console.error('שגיאה בשמירה:', err);
            setLoading(false);
        }
    };

    if (loading) return <div>טוען...</div>;

    return (
        <div className="amount-lessons" style={{ maxWidth: 400, margin: '2rem auto', background: '#fff', borderRadius: 8, boxShadow: '0 0 8px #ccc', padding: 24 }}>
            <h2>הגדרת מספר שיעורים לכל יום</h2>
            {!scheduleExists && (
                <div style={{ color: 'red', marginBottom: 12 }}>
                    אין מערכת שעות לכיתה זו. יש להגדיר קודם את מספר השיעורים לכל יום.
                </div>
            )}
            {days.map(day => (
                <div key={day.key} style={{ marginBottom: 10 }}>
                    <label style={{ marginRight: 8 }}>{day.label}:</label>
                    <input
                        type="number"
                        min="0"
                        value={lessonsPerDay[day.key]}
                        onChange={e => setLessonsPerDay(lp => ({ ...lp, [day.key]: Number(e.target.value) }))}
                        style={{ width: 60 }}
                    />
                </div>
            ))}
            <Button
                label={scheduleExists ? "עדכן מספר שיעורים" : "צור מערכת שעות"}
                onClick={handleSave}
                disabled={loading}
            />
        </div>
    );
};

export default AmountLessons;