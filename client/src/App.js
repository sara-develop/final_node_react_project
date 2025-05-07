import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Example from './components/Example';
import Example2 from './components/Example2';
import Login from './components/Login'; // וודאי שזה הנתיב הנכון
import Register from './components/Register'; // וודאי שזה הנתיב הנכון

function App() {
    return (
        <Router>
            <Routes>
                {/* עמוד login ללא Layout */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* דפים אחרים עם Layout */}
                <Route
                    path="/example"
                    element={  <Layout> <Example /> </Layout> }/>
                <Route
                    path="/example2"
                    element={
                        <Layout>
                            <Example2 />
                        </Layout>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
