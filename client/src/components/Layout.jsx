import React from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from "../assets/logo.png";
import '../layout.css';


export default function Layout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();

    const items = [
        { label: 'home page', icon: 'pi pi-home', path: '/' },
        { label: 'sudents', icon: 'pi pi-users', path: '/students' },
        { label: 'teachers', icon: 'pi pi-user', path: '/teachers' },
        { label: 'schedule', icon: 'pi pi-calendar', path: '/schedule' }
        
    ];

    const activeIndex = items.findIndex(item => item.path === location.pathname);

    return (
        <div className="flex flex-column min-h-screen">
            <TabMenu
                model={items}
                activeIndex={activeIndex >= 0 ? activeIndex : 0}
                onTabChange={(e) => navigate(items[e.index].path)}
                className="surface-100 px-3"
            />

            <div className="flex-grow p-4">
                {children}
            </div>

            <footer className="text-center py-3 surface-200">
                 <img src={logo} alt="Logo" style={{ width: "120px" }} />
            </footer>
        </div>
    );
}
