import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login'; // וודאי שזה הנתיב הנכון
import Register from './components/Register'; // וודאי שזה הנתיב הנכון
import HomePage from './components/HomePage';
import ScheduleManagement from './components/ScheduleManagement';
import StudentManagement from './components/students/StudentManagement';
import TeachersManagement from './components/teachers/TeachersManagement';

function App() {
    return (
        <Router>
            <Routes>
                {/* עמוד login ללא Layout */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* דפים אחרים עם Layout */}
                <Route
                    path="/schedule"
                    element={<Layout> <ScheduleManagement /> </Layout>}
                />
                <Route
                    path="/teachers"
                    element={<Layout> <TeachersManagement /> </Layout>}
                />
                <Route
                    path="/students"
                    element={<Layout> <StudentManagement /> </Layout>}
                />
                <Route
                    path="/"
                    element={<Layout> <HomePage /> </Layout>}
                />
            </Routes>
        </Router>
    );
}

export default App;
