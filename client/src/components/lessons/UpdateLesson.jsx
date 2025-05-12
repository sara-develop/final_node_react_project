import { useState } from "react";
import { updateLesson } from "../lessons/lessonService";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const UpdateLesson = ({ lesson, fetchLessons, setActiveComponent }) => {
    const [updatedLesson, setUpdatedLesson] = useState({ ...lesson });

    const handleSubmit = async () => {
        await updateLesson(updatedLesson._id, updatedLesson);
        fetchLessons();
        setActiveComponent("");
    };

    return (
        <div className="card">
            <h2 style={{ color: "#542468" }}>Update Lesson</h2>
            <div className="p-fluid">
                <label>Name</label>
                <InputText value={updatedLesson.name} onChange={(e) => setUpdatedLesson({ ...updatedLesson, name: e.target.value })} />
                <label>Teacher</label>
                <InputText value={updatedLesson.teacher} onChange={(e) => setUpdatedLesson({ ...updatedLesson, teacher: e.target.value })} />
                <div className="flex justify-content-end gap-2 mt-3">
                    <Button label="Cancel" severity="secondary" onClick={() => setActiveComponent("")} />
                    <Button label="Update" style={{ backgroundColor: "#542468", borderColor: "#542468" }} onClick={handleSubmit} />
                </div>
            </div>
        </div>
    );
};

export default UpdateLesson;
