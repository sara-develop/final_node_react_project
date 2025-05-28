import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { useSelector } from "react-redux";
import axios from '../../axiosConfig';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [viewMode, setViewMode] = useState(null); // "view" | "edit" | null
    const toast = useRef(null);
    const token = useSelector(state => state.user.token);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:1235/api/user/getAllUsers', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load users',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await axios.delete('http://localhost:1235/api/user/deleteUser', {
                headers: { Authorization: `Bearer ${token}` },
                data: { id }
            });
            toast.current?.show({
                severity: 'success',
                summary: 'Deleted',
                detail: `User ${id} deleted`,
                life: 3000
            });
            fetchUsers();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: `Failed to delete user`,
                life: 3000
            });
        }
    };

    const handleViewUser = (rowData) => {
        setSelectedUser(rowData);
        setViewMode("view");
    };

    const handleEditUser = (rowData) => {
        setSelectedUser(rowData);
        setViewMode("edit");
    };

    const handleClose = () => {
        setSelectedUser(null);
        setViewMode(null);
    };

    const handleSaveUser = async () => {
        try {
            // נניח שהעדכון נעשה לפי מזהה id בשרת שלך
            const response = await axios.put('http://localhost:1235/api/user/updateUser', selectedUser, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.current?.show({
                severity: 'success',
                summary: 'Updated',
                detail: `User ${selectedUser.name} updated successfully`,
                life: 3000
            });

            setViewMode(null);
            setSelectedUser(null);
            fetchUsers(); // ריענון הרשימה עם הנתונים המעודכנים
        } catch (error) {
            console.error('Error updating user:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update user',
                life: 3000
            });
        }
    };

    const roleTemplate = (rowData) => (
        <span style={{
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            backgroundColor: rowData.role === 'principal' ? '#e3f2fd' : '#f3e5f5',
            color: rowData.role === 'principal' ? '#1976d2' : '#7b1fa2',
            fontWeight: 'bold'
        }}>
            {rowData.role === 'principal' ? 'Principal' : 'Secretary'}
        </span>
    );

    const dateTemplate = (rowData) => new Date(rowData.createdAt).toLocaleDateString('he-IL');

    const actionTemplate = (rowData) => (
        <div className="flex gap-2 justify-content-end">
            <Button
                icon="pi pi-link"
                className="p-button-rounded p-button-sm"
                style={{ backgroundColor: '#542468', borderColor: '#542468' }}
                onClick={() => handleViewUser(rowData)}
                tooltip="View"
            />
            <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-sm p-button-danger"
                onClick={() => handleDeleteUser(rowData.id)}
                tooltip="Delete"
            />
            <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-sm p-button-secondary"
                onClick={() => handleEditUser(rowData)}
                tooltip="Edit"
            />
        </div>
    );

    const goBack = () => {
        navigate('/homePage');
    };

    return (
        <div className="p-4" style={{ direction: 'rtl' }}>
            <Toast ref={toast} />
            <Dialog
                header="Edit User"
                visible={viewMode === 'edit'}
                style={{ width: '30vw' }}
                onHide={handleClose}
                modal
            >
                {selectedUser && (
                    <div className="p-fluid">
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText
                                id="name"
                                value={selectedUser.name}
                                onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="id">ID</label>
                            <InputText
                                id="id"
                                value={selectedUser.id}
                                onChange={(e) => setSelectedUser({ ...selectedUser, id: e.target.value })}
                                disabled // לרוב לא מעדכנים את המזהה
                            />
                        </div>
                        <div className="flex justify-content-end gap-2 mt-4">
                            <Button
                                label="Cancel"
                                className="p-button-secondary"
                                onClick={handleClose}
                            />
                            <Button
                                label="Save"
                                style={{ backgroundColor: '#542468', borderColor: '#542468' }}
                                onClick={handleSaveUser}
                            />
                        </div>
                    </div>
                )}
            </Dialog>

            <Dialog
                header="User Details"
                visible={viewMode === 'view'}
                style={{ width: '30vw' }}
                onHide={handleClose}
                modal
            >
                <div className="p-fluid">
                    <div className="field">
                        <label>Name</label>
                        <InputText value={selectedUser?.name || ''} disabled />
                    </div>
                    <div className="field">
                        <label>ID</label>
                        <InputText value={selectedUser?.id || ''} disabled />
                    </div>
                    <div className="field">
                        <label>Role</label>
                        <InputText value={selectedUser?.role || ''} disabled />
                    </div>
                    <div className="field">
                        <label>Join Date</label>
                        <InputText value={new Date(selectedUser?.createdAt).toLocaleDateString('he-IL')} disabled />
                    </div>
                </div>
            </Dialog>

            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ color: '#542468', margin: 0 }}>All System Users</h2>
                    <Button
                        label="Back to Home Page"
                        icon="pi pi-arrow-right"
                        onClick={goBack}
                        style={{ backgroundColor: '#542468', borderColor: '#542468' }}
                        className="p-button-rounded"
                    />
                </div>

                <DataTable
                    value={users}
                    loading={loading}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    className="p-datatable-gridlines"
                    emptyMessage="No users found"
                    style={{ direction: 'ltr' }}
                    footer={`In total there are ${users.length} users.`}
                >
                    <Column field="name" header="Name" sortable />
                    <Column field="id" header="ID Number" sortable />
                    <Column field="role" header="Role" body={roleTemplate} sortable />
                    <Column field="createdAt" header="Join Date" body={dateTemplate} sortable />
                    <Column header="Actions" body={actionTemplate} style={{ textAlign: 'center', width: '10rem' }} />
                </DataTable>

                <div className="flex justify-content-center mt-4">
                    <Button
                        label="+ Add User"
                        className="p-button-rounded"
                        style={{ backgroundColor: '#542468', borderColor: '#542468' }}
                    // כאן תוכל להוסיף פתיחת דיאלוג להוספה
                    />
                </div>
            </Card>
        </div>
    );
};

export default AllUsers;

