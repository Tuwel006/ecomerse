import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import userService from '../../services/userService';
import AdminLayout from '../../components/AdminLayout';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('table');
    const { error, success } = useToast();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await userService.getAllUsers();
            setUsers(data.users || []);
        } catch (err) {
            error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await userService.updateUserRole(userId, newRole);
            success('User role updated');
            fetchUsers();
        } catch (err) {
            error('Failed to update role');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await userService.deleteUser(id);
                success('User deleted successfully');
                fetchUsers();
            } catch (err) {
                error('Failed to delete user');
            }
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Manage Users">
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Manage Users">
            <div className="container-wide mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">Manage Users</h1>
                            <p className="text-gray-600 mt-1 text-sm sm:text-base">View and manage user accounts</p>
                        </div>
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`px-3 py-1 text-sm rounded-md transition-colors touch-target ${
                                    viewMode === 'table' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                                }`}
                            >
                                Table
                            </button>
                            <button
                                onClick={() => setViewMode('cards')}
                                className={`px-3 py-1 text-sm rounded-md transition-colors touch-target ${
                                    viewMode === 'cards' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                                }`}
                            >
                                Cards
                            </button>
                        </div>
                    </div>
                </div>

                {/* Desktop Table View */}
                {viewMode === 'table' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hidden md:block">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                                                        {user.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div className="ml-4 min-w-0">
                                                        <div className="text-sm font-medium text-gray-900 truncate">{user.name}</div>
                                                        <div className="text-sm text-gray-500 truncate">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                                                >
                                                    <option value="viewer">Viewer</option>
                                                    <option value="author">Author</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                    user.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button 
                                                    onClick={() => handleDelete(user._id)} 
                                                    className="text-red-600 hover:text-red-900 touch-target"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {users.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No users found.
                            </div>
                        )}
                    </div>
                )}

                {/* Mobile Card View */}
                <div className={`grid grid-cols-1 gap-4 sm:gap-6 ${viewMode === 'cards' ? 'block' : 'md:hidden'}`}>
                    {users.map((user) => (
                        <div key={user._id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
                            <div className="flex items-start space-x-4">
                                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                                    {user.name?.charAt(0) || 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 truncate">{user.name}</h3>
                                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                        </div>
                                        <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${
                                            user.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {user.status}
                                        </span>
                                    </div>
                                    
                                    <div className="mt-4 space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white touch-target"
                                            >
                                                <option value="viewer">Viewer</option>
                                                <option value="author">Author</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>
                                        
                                        <button 
                                            onClick={() => handleDelete(user._id)} 
                                            className="w-full btn btn-secondary touch-target"
                                        >
                                            Delete User
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {users.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <p>No users found.</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default UserManagement;
