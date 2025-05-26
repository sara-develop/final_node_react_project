import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import axios from 'axios';
import { useSelector } from 'react-redux'; // לקריאת מידע מה־Redux store


const AttendanceDialog = ({ visible, onHide, selectedDay, lessonIndex, classNumber, schedule }) => {
    const token = useSelector(state => state.user.token)  // קריאת שם המשתמש מה־Redux, או ברירת מחדל

    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState([]);

    // Extract lessonId from the schedule based on selected day and lesson index
    const lessonId = schedule[selectedDay]?.lessons?.[lessonIndex]?._id;

    // Fetch students' attendance data for the given lesson
    const fetchStudents = async () => {
        try {
            const response = await axios.get(
                `http://localhost:1235/api/student/getAttendanceByLesson/${classNumber}/${selectedDay}/${lessonId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setStudents(response.data);
            // Initialize attendance state with idNumber and status for each student
            setAttendance(
                response.data.map((student) => ({
                    idNumber: student.idNumber,
                    status: student.status,
                }))
            );
        } catch (error) {
            console.error('Error fetching attendance:', error);
        }
    };

    // Fetch students whenever dialog is opened
    useEffect(() => {
        if (visible) {
            fetchStudents();
        }
    }, [visible]);

    // Update attendance status locally when user clicks a status button
    const handleStatusChange = (idNumber, status) => {
        setAttendance((prev) =>
            prev.map((a) => (a.idNumber === idNumber ? { ...a, status } : a))
        );
    };

    // Save attendance updates by sending PUT request with auth token
    const handleSaveAttendance = () => {
        if (!lessonId) {
            alert('No lesson selected or lesson ID missing!');
            return; // Stop if no lesson ID
        }

        const token = localStorage.getItem('token');

        axios
            .put(
                'http://localhost:1235/api/student/updateAttendanceForLesson',
                {
                    classNumber,
                    day: selectedDay,
                    lessonId,
                    lessonIndex, // Sending lesson index too if needed by backend
                    attendanceUpdates: attendance,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then(() => {
                console.log('Attendance saved successfully');
                onHide();
            })
            .catch((err) => {
                console.error('Error updating attendance:', err);
                alert('Error updating attendance. Please try again later.');
            });
    };

    return (
        <Dialog
            header="Manage Attendance"
            visible={visible}
            onHide={onHide}
            style={{ width: '50vw', minWidth: '350px' }}
            breakpoints={{ '960px': '90vw', '640px': '100vw' }}
            footer={
                <Button
                    label="Save"
                    icon="pi pi-check"
                    onClick={handleSaveAttendance}
                    style={{
                        backgroundColor: '#542468',
                        border: 'none',
                        color: 'white',
                        width: '100%',
                        fontWeight: 'bold',
                    }}
                />
            }
        >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f4f4f4' }}>
                        <th style={{ textAlign: 'left', padding: '0.75rem' }}>Name</th>
                        <th style={{ textAlign: 'left', padding: '0.75rem' }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length === 0 && (
                        <tr>
                            <td colSpan={2} style={{ padding: '1rem', textAlign: 'center', fontStyle: 'italic' }}>
                                No students found.
                            </td>
                        </tr>
                    )}
                    {students.map((student) => {
                        const currentStatus = attendance.find((a) => a.idNumber === student.idNumber)?.status;

                        return (
                            <tr key={student.idNumber} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '0.75rem' }}>{student.name}</td>
                                <td style={{ padding: '0.75rem' }}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <Button
                                            label="Present"
                                            className={`p-button ${currentStatus === 'Present' ? 'p-button-success' : 'p-button-outlined'
                                                }`}
                                            onClick={() => handleStatusChange(student.idNumber, 'Present')}
                                            style={{ minWidth: '75px' }}
                                        />
                                        <Button
                                            label="Late"
                                            className={`p-button ${currentStatus === 'Late' ? 'p-button-warning' : 'p-button-outlined'
                                                }`}
                                            onClick={() => handleStatusChange(student.idNumber, 'Late')}
                                            style={{ minWidth: '75px' }}
                                        />
                                        <Button
                                            label="Absent"
                                            className={`p-button ${currentStatus === 'Absent' ? 'p-button-danger' : 'p-button-outlined'
                                                }`}
                                            onClick={() => handleStatusChange(student.idNumber, 'Absent')}
                                            style={{ minWidth: '75px' }}
                                        />
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </Dialog>
    );
};

export default AttendanceDialog;
