import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

const AdminLayout = ({ children, title = 'Admin Dashboard' }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useAuth();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, []);

    // Close sidebar on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            
            {/* Main Content */}
            <div className="flex-1 md:ml-64">
                {/* Mobile Header */}
                <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 text-gray-600 hover:text-gray-900 touch-target focus-ring rounded-lg"
                        aria-label="Open sidebar"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-semibold text-gray-900 truncate">{title}</h1>
                    <div className="w-10 flex justify-end">
                        {user && (
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                {user.name?.charAt(0) || 'U'}
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Area */}
                <main className="flex-1 custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;