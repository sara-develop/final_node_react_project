import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';

const ScheduleTable = ({ classNumber }) => {
    const [lessons, setLessons] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [showAttendanceDialog, setShowAttendanceDialog] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [lessonIndex, setLessonIndex] = useState(null);
    const [schedule, setSchedule] = useState({});
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState([]);

    // שליפת כל השיעורים מה-API
    const fetchLessons = async () => {
        try {
            const response = await axios.get('http://localhost:1235/api/lesson/getAllLessons');
            setLessons(response.data);
        } catch (error) {
            console.error('Error fetching lessons:', error);
        }
    };

    // שליפת מערכת שעות מסוימת
    const fetchSchedule = async () => {
        try {
            const response = await axios.get(`http://localhost:1235/api/schedule/getScheduleByClassNumber/${classNumber}`);
            setSchedule(response.data);
        } catch (error) {
            console.error('Error fetching schedule:', error);
        }
    };

    const fetchStudents = async () => {
        try {
            const response = await axios.get(`http://localhost:1235/api/student?classNumber=${classNumber}`);
            setStudents(response.data);
            setAttendance(response.data.map(student => ({
                idNumber: student.idNumber,
                status: 'Absent', // ברירת מחדל
            })));
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    useEffect(() => {
        fetchLessons();
        fetchSchedule();
    }, [classNumber]);

    useEffect(() => {
        if (showAttendanceDialog) {
            fetchStudents();
        }
    }, [showAttendanceDialog]);

    const handleEdit = (day, lessonIndex) => {
        setSelectedDay(day);
        setLessonIndex(lessonIndex);
        setSelectedLesson(schedule[day]?.lessons?.[lessonIndex] || null);
        setShowDialog(true);
    };

    const handleLessonSelect = (e) => {
        setSelectedLesson(e.value);
    };

    const handleSave = () => {
        const updatedSchedule = { ...schedule };
        updatedSchedule[selectedDay].lessons[lessonIndex] = selectedLesson;
    
        axios.put('http://localhost:1235/api/schedule/updateSchedule', {
            classNumber,
            scheduleUpdates: updatedSchedule
        })
            .then(() => {
                fetchSchedule(); // טוען מחדש את המערכת לאחר שמירה
                setShowDialog(false);
            })
            .catch(err => {
                console.error('Error saving schedule:', err);
            });
    };

    const handleAttendance = (day, lessonIndex) => {
        setSelectedDay(day);
        setLessonIndex(lessonIndex);
        setShowAttendanceDialog(true); // פותח את הדיאלוג לניהול נוכחות
    };

    const handleStatusChange = (idNumber, status) => {
        setAttendance(prev =>
            prev.map(a => (a.idNumber === idNumber ? { ...a, status } : a))
        );
    };

    const handleSaveAttendance = () => {
        axios.put('http://localhost:1235/api/attendance/updateAttendance', {
            classNumber,
            day: selectedDay,
            lessonId: schedule[selectedDay]?.lessons?.[lessonIndex]?._id,
            attendanceUpdates: attendance,
        })
            .then(() => {
                alert('Attendance updated successfully');
                setShowAttendanceDialog(false);
            })
            .catch(err => {
                console.error('Error updating attendance:', err);
            });
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
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        marginTop: '20px',
                    }}
                >
                    <thead>
                        <tr>
                            <th style={{ padding: '10px', backgroundColor: '#f1f1f1', fontWeight: 'bold' }}>Lesson</th>
                            {days.map(day => (
                                <th key={day.key} style={{ padding: '10px', backgroundColor: '#f1f1f1' }}>
                                    {day.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 8 }, (_, lessonIndex) => (
                            <tr key={lessonIndex}>
                                <td style={{ padding: '10px' }}>Lesson {lessonIndex + 1}</td>
                                {days.map(day => (
                                    <td key={day.key} style={{ padding: '10px', position: 'relative' }}>
                                        <div
                                            style={{
                                                backgroundColor: '#fff',
                                                border: '1px solid #ddd',
                                                borderRadius: '8px',
                                                padding: '10px',
                                                cursor: 'pointer',
                                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                                                transition: 'all 0.2s',
                                            }}
                                        >
                                            <span style={{ fontSize: '14px', color: '#333' }}>
                                                {schedule[day.key]?.lessons?.[lessonIndex]?.name || 'No Lesson'}
                                            </span>
                                            <Button
                                                icon="pi pi-pencil"
                                                className="p-button-text"
                                                style={{
                                                    position: 'absolute',
                                                    top: '5px',
                                                    right: '5px',
                                                    fontSize: '12px',
                                                    color: '#542468',
                                                }}
                                                onClick={() => handleEdit(day.key, lessonIndex)}
                                            />
                                            <Button
                                                label="Attendance"
                                                className="p-button-text"
                                                style={{
                                                    position: 'absolute',
                                                    bottom: '5px',
                                                    right: '5px',
                                                    fontSize: '12px',
                                                    color: '#007bff',
                                                }}
                                                onClick={() => handleAttendance(day.key, lessonIndex)}
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
                <h2 style={{ textAlign: 'center', color: '#4B296L', marginBottom: '2rem' }}>Weekly Schedule</h2>
                {renderSchedule()}

                {/* פופ-אפ לבחירת שיעור */}
                <Dialog
                    header="Choose a Lesson"
                    visible={showDialog}
                    onHide={() => setShowDialog(false)}
                    style={{ width: '50vw' }}
                    footer={
                        <Button
                            label="Save"
                            icon="pi pi-check"
                            onClick={handleSave}
                            style={{
                                backgroundColor: '#542468',
                                border: 'none',
                                color: 'white',
                                width: '100%',
                            }}
                        />
                    }
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

                {/* פופ-אפ לניהול נוכחות */}
                <Dialog
                    header="Manage Attendance"
                    visible={showAttendanceDialog}
                    onHide={() => setShowAttendanceDialog(false)}
                    style={{ width: '50vw' }}
                    footer={
                        <Button
                            label="Save"
                            icon="pi pi-check"
                            onClick={handleSaveAttendance}
                            style={{
                                backgroundColor: '#007bff',
                                border: 'none',
                                color: 'white',
                                width: '100%',
                            }}
                        />
                    }
                >
                    <table style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student.idNumber}>
                                    <td>{student.name}</td>
                                    <td>
                                        <select
                                            value={
                                                attendance.find(a => a.idNumber === student.idNumber)?.status || 'Absent'
                                            }
                                            onChange={e => handleStatusChange(student.idNumber, e.target.value)}
                                        >
                                            <option value="Present">Present</option>
                                            <option value="Late">Late</option>
                                            <option value="Absent">Absent</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Dialog>
            </div>
        </div>
    );
};

export default ScheduleTable;
