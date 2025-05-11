import { useState } from 'react';
import Axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

export default function AddStudent({ fetchStudents, setActiveComponent }) {
    const [name, setName] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [parentEmail, setParentEmail] = useState('');
    const [error, setError] = useState('');

    const handleAddStudent = async () => {
        try {
            const token = localStorage.getItem("token");

            await Axios.post(
                'http://localhost:1235/api/student/addStudent',

                { name, idNumber, parentEmail },
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
        <div className="card">
            <h2>הוספת תלמידה</h2>
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            <div className="p-field">
                <label>שם</label>
                <InputText value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="p-field">
                <label>תעודת זהות</label>
                <InputText value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />
            </div>
            <div className="p-field">
                <label>מייל הורה</label>
                <InputText value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} />
            </div>

            <Button label="הוספה" icon="pi pi-check" onClick={handleAddStudent} />
            <Button label="ביטול" icon="pi pi-times" className="p-button-secondary ml-2" onClick={() => setActiveComponent("")} />
        </div>
    );
}
