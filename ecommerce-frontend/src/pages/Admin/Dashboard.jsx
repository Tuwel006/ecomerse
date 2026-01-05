import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import statsService from '../../services/statsService';
import AdminLayout from '../../components/AdminLayout';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { error } = useToast();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await statsService.getDashboardStats();
                setStats(data.stats);
            } catch (err) {
                error('Failed to load dashboard statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [error]);

    if (loading) {
        return (
            <AdminLayout title="Dashboard">
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Dashboard">
            <div className="container-wide mx-auto px-4 sm:px-6 py-6 sm:py-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">Admin Dashboard</h1>
                                <p className="text-gray-600 mt-1 text-sm sm:text-base">Welcome back, {user?.name}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                <Link to="/newpost" className="btn btn-primary w-full sm:w-auto text-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Create New Post
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <StatsCard
                            title="Total Posts"
                            value={stats?.posts?.total || stats?.totalPosts || 3}
                            icon="document"
                            color="bg-blue-50 text-blue-600"
                        />
                        <StatsCard
                            title="Total Users"
                            value={stats?.users?.total || stats?.totalUsers || 2}
                            icon="users"
                            color="bg-green-50 text-green-600"
                        />
                        <StatsCard
                            title="Total Comments"
                            value={stats?.comments?.total || stats?.totalComments || 0}
                            icon="chat"
                            color="bg-purple-50 text-purple-600"
                        />
                        <StatsCard
                            title="Total Views"
                            value={stats?.posts?.views || stats?.totalViews || 790}
                            icon="eye"
                            color="bg-orange-50 text-orange-600"
                        />
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                            <h2 className="text-lg sm:text-xl font-display font-bold text-gray-900 mb-4">Quick Actions</h2>
                            <div className="space-y-2 sm:space-y-3">
                                <Link to="/admin/posts" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group touch-target">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors flex-shrink-0">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
                                    </div>
                                    <div className="ml-4 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">Manage Posts</p>
                                        <p className="text-xs text-gray-500 hidden sm:block">View, edit, and delete posts</p>
                                    </div>
                                </Link>

                                <Link to="/admin/categories" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group touch-target">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors flex-shrink-0">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                                    </div>
                                    <div className="ml-4 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">Categories</p>
                                        <p className="text-xs text-gray-500 hidden sm:block">Manage categories and tags</p>
                                    </div>
                                </Link>

                                <Link to="/admin/users" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group touch-target">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors flex-shrink-0">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                    </div>
                                    <div className="ml-4 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">Users</p>
                                        <p className="text-xs text-gray-500 hidden sm:block">Manage users and roles</p>
                                    </div>
                                </Link>

                                <Link to="/admin/analytics" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group touch-target">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors flex-shrink-0">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                    </div>
                                    <div className="ml-4 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">Analytics</p>
                                        <p className="text-xs text-gray-500 hidden sm:block">View site statistics</p>
                                    </div>
                                </Link>

                                <Link to="/admin/settings" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group touch-target">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-gray-600 group-hover:text-white transition-colors flex-shrink-0">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                    </div>
                                    <div className="ml-4 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">Settings</p>
                                        <p className="text-xs text-gray-500 hidden sm:block">Site configuration</p>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                            <h2 className="text-lg sm:text-xl font-display font-bold text-gray-900 mb-4">Recent Activity</h2>
                            <div className="space-y-6">
                                {/* Enhanced Recent Activity */}
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm text-gray-900">New post created</p>
                                            <p className="text-xs text-gray-500">2 hours ago</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm text-gray-900">New user registered</p>
                                            <p className="text-xs text-gray-500">5 hours ago</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                            </svg>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm text-gray-900">New comment posted</p>
                                            <p className="text-xs text-gray-500">1 day ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </AdminLayout>
    );
};

const StatsCard = ({ title, value, icon, color }) => {
    const getIcon = () => {
        switch (icon) {
            case 'document':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />;
            case 'users':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />;
            case 'chat':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />;
            case 'eye':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${color} flex-shrink-0`}>
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {getIcon()}
                    </svg>
                </div>
                <div className="ml-3 sm:ml-4 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">{title}</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
