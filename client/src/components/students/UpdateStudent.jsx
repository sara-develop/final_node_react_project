import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import Axios from 'axios';

const UpdateStudent = ({ fetchStudents, student, setActiveComponent }) => {
    const [updatedStudent, setUpdatedStudent] = useState(student);

    const handleChange = (e) => {
        setUpdatedStudent({ ...updatedStudent, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        await Axios.put(`http://localhost:1235/api/student/updateStudent/${updatedStudent._id}`, updatedStudent);
        fetchStudents();
        setActiveComponent("");
    };

    useEffect(() => {
        setUpdatedStudent(student);
    }, [student]);

    const purpleColor = '#542468';

    const buttonStyle = {
        backgroundColor: purpleColor,
        borderColor: purpleColor,
        color: '#FFFFFF',
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#FFFFFF', // רקע כללי לבן
        }}>
            <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '2rem',
                width: '100%',
                maxWidth: '400px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                position: 'relative',
            }}>
                {/* כפתור איקס */}
                <Button
                    icon="pi pi-times"
                    onClick={() => setActiveComponent("")}
                    className="p-button-rounded p-button-text"
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        color: purpleColor,
                        backgroundColor: 'transparent',
                        border: 'none',
                        fontSize: '1.2rem',
                    }}
                />

                <h3 style={{ color: purpleColor, fontWeight: 'bold', marginTop: '0' }}>Update Student</h3>

                <div className="p-fluid">
                    <div className="mb-3">
                        <label className="block font-bold mb-1" style={{ color: purpleColor }}>Name</label>
                        <InputText name="name" value={updatedStudent.name} onChange={handleChange} placeholder="Name" />
                    </div>

                    <div className="mb-3">
                        <label className="block font-bold mb-1" style={{ color: purpleColor }}>ID Number</label>
                        <InputText name="idNumber" value={updatedStudent.idNumber} onChange={handleChange} placeholder="ID Number" />
                    </div>

                    <div className="mb-3">
                        <label className="block font-bold mb-1" style={{ color: purpleColor }}>Class Number</label>
                        <InputText name="classNumber" value={updatedStudent.classNumber} onChange={handleChange} placeholder="Class Number" />
                    </div>

                    <div className="mb-3">
                        <label className="block font-bold mb-1" style={{ color: purpleColor }}>Parent Email</label>
                        <InputText name="parentEmail" value={updatedStudent.parentEmail} onChange={handleChange} placeholder="Parent Email" />
                    </div>

                    <Button label="Update" onClick={handleSubmit} style={buttonStyle} />
                </div>
            </div>
        </div>
    );
};

export default UpdateStudent;
