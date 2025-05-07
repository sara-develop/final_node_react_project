// src/components/Layout.js
import React from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();

    const items = [
        { label: 'דוגמה', icon: 'pi pi-sign-in', path: '/example' },
        { label: 'דוגמה 2', icon: 'pi pi-sign-in', path: '/example2' }
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
                <img src="/logo.png" alt="לוגו" style={{ height: '40px' }} />
            </footer>
        </div>
    );
}
