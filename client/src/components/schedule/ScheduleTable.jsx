import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';

const ScheduleTable = () => {
    const [lessons, setLessons] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [showDialog, setShowDialog] = useState(false);  // מצב להציג את הפופ-אפ
    const [selectedDay, setSelectedDay] = useState(null); // אם צריך לשמור את היום שנבחר
    const [lessonIndex, setLessonIndex] = useState(null); // אם צריך לשמור את האינדקס של השיעור

    // שליפת כל השיעורים מה-API
    const fetchLessons = async () => {
        try {
            const response = await axios.get('/api/getAllLessons'); // URL המתאים לאפיון ה-API שלך
            setLessons(response.data);  // עדכון המערך של השיעורים
        } catch (error) {
            console.error('Error fetching lessons:', error);
        }
    };

    useEffect(() => {
        fetchLessons(); // קריאה לפונקציה בטעינה הראשונית
    }, []);

    const handleEdit = (classNumber, day, lessonIndex) => {
        setSelectedDay(day);
        setLessonIndex(lessonIndex);
        setShowDialog(true);  // פותח את חלון הבחירה
    };

    const handleLessonSelect = (e) => {
        setSelectedLesson(e.value); // עדכון השיעור שנבחר
        setShowDialog(false); // סגירת הפופ-אפ
    };

    const renderSchedule = () => {
        const days = [
            { key: 'sunday', label: 'Sunday' },
            { key: 'monday', label: 'Monday' },
            { key: 'tuesday', label: 'Tuesday' },
            { key: 'wednesday', label: 'Wednesday' },
            { key: 'thursday', label: 'Thursday' },
        ];

        return (
            <div style={{ overflowX: 'auto' }}>
                <table
                    style={{
                        borderCollapse: 'collapse',
                        width: '100%',
                        textAlign: 'center',
                        fontFamily: 'Arial, sans-serif',
                        direction: 'ltr',
                        tableLayout: 'fixed',
                    }}
                >
                    <thead>
                        <tr>
                            <th>Lesson</th>
                            {days.map(day => (
                                <th key={day.key}>{day.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 8 }, (_, lessonIndex) => (
                            <tr key={lessonIndex}>
                                <td>Lesson {lessonIndex + 1}</td>
                                {days.map(day => (
                                    <td key={day.key}>
                                        <div style={{ position: 'relative', height: '50px' }}>
                                            <Button
                                                icon="pi pi-pencil"
                                                onClick={() => handleEdit(classNumber, day.key, lessonIndex + 1)}
                                                style={{
                                                    fontSize: '12px',
                                                    padding: '4px',
                                                    position: 'absolute',
                                                    top: '4px',
                                                    right: '4px',
                                                    backgroundColor: '#542468',
                                                    border: 'none',
                                                    color: 'white',
                                                }}
                                            />
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f9f9f9',
                padding: '2rem',
            }}
        >
            <div style={{ width: '90%', maxWidth: '1000px' }}>
                <h2 style={{ textAlign: 'center', color: '#4B296B', marginBottom: '2rem' }}>Weekly Schedule</h2>
                {renderSchedule()}

                {/* פופ-אפ לבחירת שיעור */}
                <Dialog
                    header="Choose a Lesson"
                    visible={showDialog}
                    onHide={() => setShowDialog(false)}
                    style={{ width: '50vw' }}
                >
                    <Dropdown
                        value={selectedLesson}
                        options={lessons}
                        onChange={handleLessonSelect}
                        optionLabel="name"
                        placeholder="Select a lesson"
                        style={{ width: '100%' }}
                    />
                </Dialog>
            </div>
        </div>
    );
};

export default ScheduleTable;
