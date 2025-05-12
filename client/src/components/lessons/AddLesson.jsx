import { useState } from "react";
import { addLesson } from "../lessons/lessonService";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const AddLesson = ({ fetchLessons, setActiveComponent }) => {
    const [lesson, setLesson] = useState({ name: "", teacher: "" });

    const handleSubmit = async () => {
        await addLesson(lesson);
        fetchLessons();
        setActiveComponent("");
    };

    return (
        <div className="card">
            <h2 style={{ color: "#542468" }}>Add Lesson</h2>
            <div className="p-fluid">
                <label>Name</label>
                <InputText value={lesson.name} onChange={(e) => setLesson({ ...lesson, name: e.target.value })} />
                <label>Teacher</label>
                <InputText value={lesson.teacher} onChange={(e) => setLesson({ ...lesson, teacher: e.target.value })} />
                <div className="flex justify-content-end gap-2 mt-3">
                    <Button label="Cancel" severity="secondary" onClick={() => setActiveComponent("")} />
                    <Button label="Save" style={{ backgroundColor: "#542468", borderColor: "#542468" }} onClick={handleSubmit} />
                </div>
            </div>
        </div>
    );
};

export default AddLesson;
