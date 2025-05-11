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
        await Axios.put(`http://localhost:1234/api/student/${updatedStudent._id}`, updatedStudent);
        fetchStudents();
        setActiveComponent("");
    };

    useEffect(() => {
        setUpdatedStudent(student);
    }, [student]);

    return (
        <div className="card p-4">
            <h3>Update Student</h3>
            <div className="p-fluid">
                <InputText name="name" value={updatedStudent.name} onChange={handleChange} placeholder="Name" className="mb-3" />
                <InputText name="idNumber" value={updatedStudent.idNumber} onChange={handleChange} placeholder="ID Number" className="mb-3" />
                <InputText name="classNumber" value={updatedStudent.classNumber} onChange={handleChange} placeholder="Class Number" className="mb-3" />
                <InputText name="parentEmail" value={updatedStudent.parentEmail} onChange={handleChange} placeholder="Parent Email" className="mb-3" />
                <Button label="Update" onClick={handleSubmit} />
            </div>
        </div>
    );
};

export default UpdateStudent;
