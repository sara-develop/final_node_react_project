import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import Axios from 'axios';
import UpdateStudent from './UpdateStudent';
import AddStudent from './AddStudent';

const StudentManagement = () => {
    const [allStudents, setAllStudents] = useState([]);
    const [activeComponent, setActiveComponent] = useState("");
    const [student, setStudent] = useState("");

    const fetchStudents = async () => {
        const token = localStorage.getItem("token");
        const { data } = await Axios.get('http://localhost:1235/api/student/getAllStudents', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setAllStudents(data);
    };
    
    
    const deleteStudent = async (id) => {
        const token = localStorage.getItem("token");
        await Axios.delete(`http://localhost:1235/api/student/deleteStudent/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        fetchStudents();
    };
    

    useEffect(() => {
        fetchStudents();
    }, []);

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold">Students</span>
        </div>
    );

    const footer = `In total there are ${allStudents ? allStudents.length : 0} students.`;

    return (
        <div className="card">
            {activeComponent === "update" ? (
                <UpdateStudent fetchStudents={fetchStudents} student={student} setActiveComponent={setActiveComponent} />
            ) : activeComponent === "add" ? (
                <AddStudent fetchStudents={fetchStudents} setActiveComponent={setActiveComponent} />
            ) : (
                <>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <Button style={{ marginBottom: "5px" }} onClick={() => setActiveComponent("add")} icon="pi pi-plus" className="p-button-rounded">
                            Add Student
                        </Button>
                    </div>
                    <DataTable value={allStudents} header={header} footer={footer} tableStyle={{ minWidth: '60rem' }}>
                        <Column field="name" header="Name" />
                        <Column field="idNumber" header="ID Number" />
                        <Column field="classNumber" header="Class Number" />
                        <Column field="parentEmail" header="Parent Email" />
                        <Column field="active" header="Active" />
                        <Column body={(rowData) => (
                            <div className="flex align-items-center gap-2">
                                <Button onClick={() => deleteStudent(rowData._id)} icon="pi pi-trash" className="p-button-rounded" />
                                <Button onClick={() => {
                                    setActiveComponent("update");
                                    setStudent(rowData);
                                }} icon="pi pi-pencil" className="p-button-rounded" />
                            </div>
                        )} />
                    </DataTable>
                </>
            )}
        </div>
    );
};

export default StudentManagement;
