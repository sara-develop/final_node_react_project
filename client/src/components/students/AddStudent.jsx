import { useState } from 'react';
import Axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

export default function AddStudent({ fetchStudents, setActiveComponent }) {
    const [name, setName] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [parentEmail, setParentEmail] = useState('');
    const [classNumber, setClassNumber] = useState('');
    const [error, setError] = useState('');

    const handleAddStudent = async () => {
        try {
            const token = localStorage.getItem("token");

            await Axios.post('http://localhost:1235/api/student/addStudent',
                { name, idNumber, parentEmail, classNumber},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            fetchStudents();
            setActiveComponent("");
        } catch (err) {
            const message = err.response?.data?.message || "שגיאה בלתי צפויה";
            setError(message);
        }
    };

    return (
        <div className="card p-4">
            <h2 className="mb-4" style={{ color: "#542468" }}>הוספת תלמידה</h2>
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            <div className="mb-3">
                <label className="block font-bold mb-1">Name</label>
                <InputText value={name} onChange={(e) => setName(e.target.value)} className="w-full" />
            </div>
            <div className="mb-3">
                <label className="block font-bold mb-1">ID Number</label>
                <InputText value={idNumber} onChange={(e) => setIdNumber(e.target.value)} className="w-full" />
            </div>
            <div className="mb-3">
                <label className="block font-bold mb-1">Parent Email</label>
                <InputText value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} className="w-full" />
            </div>
            <div className="mb-3">
                <label className="block font-bold mb-1">Class Number</label>
                <InputText value={classNumber} onChange={(e) => setClassNumber(e.target.value)} className="w-full" />
            </div>

            <div className="flex gap-2">
                <Button label="Add" icon="pi pi-check" onClick={handleAddStudent} style={{ backgroundColor: "#542468", borderColor: "#542468" }} />
                <Button label="Cancel" icon="pi pi-times" className="p-button-outlined" style={{ color: "#58585a", borderColor: "#58585a" }} onClick={() => setActiveComponent("")} />
            </div>
        </div>
    );
}
