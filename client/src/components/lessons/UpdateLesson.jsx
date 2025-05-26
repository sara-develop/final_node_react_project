import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const API = "http://localhost:1235/api/lesson";

const UpdateLesson = ({ lesson, fetchLessons, setActiveComponent }) => {
    const [updatedLesson, setUpdatedLesson] = useState({ ...lesson });
    const token = useSelector(state => state.user.token);

    const handleSubmit = async () => {
        await axios.put(
            `${API}/updateLesson/${updatedLesson._id}`,
            updatedLesson,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchLessons();
        setActiveComponent("");
    };

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
            alignItems: 'flex-start',
            minHeight: '100vh',
            paddingTop: '3rem',
            backgroundColor: '#FFFFFF',
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
                <h3 style={{ color: purpleColor, fontWeight: 'bold', marginTop: '0' }}>Edit Lesson</h3>

                <div className="p-fluid">
                    <div className="mb-3">
                        <label className="block font-bold mb-1" style={{ color: purpleColor }}>Name</label>
                        <InputText
                            value={updatedLesson.name}
                            onChange={(e) => setUpdatedLesson({ ...updatedLesson, name: e.target.value })}
                            placeholder="Name"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block font-bold mb-1" style={{ color: purpleColor }}>Teacher</label>
                        <InputText
                            value={updatedLesson.teacher}
                            onChange={(e) => setUpdatedLesson({ ...updatedLesson, teacher: e.target.value })}
                            placeholder="Teacher"
                        />
                    </div>
                    <div className="flex justify-center">
                        <Button label="Update" onClick={handleSubmit} style={buttonStyle} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateLesson;
