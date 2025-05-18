import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import axios from 'axios';

const AttendanceDialog = ({ visible, onHide, selectedDay, lessonIndex, classNumber }) => {
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState([]);

    const fetchStudents = async () => {
        try {

            const response = await axios.get(`http://localhost:1235/api/student/getAttendanceByLesson/${classNumber}/${selectedDay}/${lessonIndex}`);
            setStudents(response.data);
            setAttendance(response.data.map(student => ({
                idNumber: student.idNumber,
                status: student.status, // סטטוס מעודכן מהשרת
            })));
        } catch (error) {
            console.error('Error fetching attendance:', error);
        }
    };

    useEffect(() => {
        if (visible) {
            fetchStudents();
        }
    }, [visible]);

    const handleStatusChange = (idNumber, status) => {
        setAttendance(prev =>
            prev.map(a => (a.idNumber === idNumber ? { ...a, status } : a))
        );
    };

    const handleSaveAttendance = () => {
        axios.put('http://localhost:1235/api/student/updateAttendanceForLesson', {
            classNumber,
            day: selectedDay,
            lessonId: lessonIndex,
            attendanceUpdates: attendance,
        })
            .then(() => {
                console.log('Attendance saved successfully');
                onHide(); // סגירת הדיאלוג
            })
            .catch(err => {
                console.error('Error updating attendance:', err);
            });
    };

    return (
        <Dialog
            header="Manage Attendance"
            visible={visible}
            onHide={onHide}
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
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <Button
                                        label="Present"
                                        className={`p-button ${attendance.find(a => a.idNumber === student.idNumber)?.status === 'Present' ? 'p-button-success' : 'p-button-outlined'}`}
                                        onClick={() => handleStatusChange(student.idNumber, 'Present')}
                                    />
                                    <Button
                                        label="Late"
                                        className={`p-button ${attendance.find(a => a.idNumber === student.idNumber)?.status === 'Late' ? 'p-button-warning' : 'p-button-outlined'}`}
                                        onClick={() => handleStatusChange(student.idNumber, 'Late')}
                                    />
                                    <Button
                                        label="Absent"
                                        className={`p-button ${attendance.find(a => a.idNumber === student.idNumber)?.status === 'Absent' ? 'p-button-danger' : 'p-button-outlined'}`}
                                        onClick={() => handleStatusChange(student.idNumber, 'Absent')}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Dialog>
    );
};

export default AttendanceDialog;