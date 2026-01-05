import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import AdminLayout from '../../components/AdminLayout';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        general: {
            siteName: 'Techcentry',
            siteDescription: 'A platform for sharing insights and knowledge',
            siteUrl: 'https://yourblog.com',
            adminEmail: 'tuwelshaikh006@gmail.com',
            timezone: 'UTC',
            language: 'en'
        },
        appearance: {
            theme: 'light',
            primaryColor: '#1e3a8a',
            logo: '',
            favicon: '',
            customCSS: ''
        },
        content: {
            postsPerPage: 10,
            allowComments: true,
            moderateComments: true,
            allowRegistration: true,
            defaultUserRole: 'viewer',
            enableSEO: true
        },
        email: {
            smtpHost: '',
            smtpPort: 587,
            smtpUser: '',
            smtpPassword: '',
            fromEmail: 'noreply@techcentry.com',
            fromName: 'Techcentry'
        },
        security: {
            enableTwoFactor: false,
            sessionTimeout: 24,
            maxLoginAttempts: 5,
            enableCaptcha: false,
            allowedFileTypes: 'jpg,jpeg,png,gif,pdf,doc,docx'
        },
        backup: {
            autoBackup: true,
            backupFrequency: 'daily',
            retentionDays: 30,
            lastBackup: '2024-01-15T10:30:00Z'
        }
    });
    const { success, error } = useToast();

    const handleSave = async (section) => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            success(`${section} settings saved successfully`);
        } catch (err) {
            error('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    const updateSetting = (section, key, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
    };

    const tabs = [
        { id: 'general', name: 'General', icon: '⚙️' },
        { id: 'appearance', name: 'Appearance', icon: '🎨' },
        { id: 'content', name: 'Content', icon: '📝' },
        { id: 'email', name: 'Email', icon: '📧' },
        { id: 'security', name: 'Security', icon: '🔒' },
        { id: 'backup', name: 'Backup', icon: '💾' }
    ];

    return (
        <AdminLayout title="Settings">
            <div className="container-wide mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your blog configuration and preferences</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Navigation */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                            <nav className="space-y-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors touch-target ${
                                            activeTab === tab.id
                                                ? 'bg-primary text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <span>{tab.icon}</span>
                                        <span>{tab.name}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                            {/* General Settings */}
                            {activeTab === 'general' && (
                                <div className="p-6">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-2">General Settings</h2>
                                        <p className="text-gray-600 text-sm">Basic configuration for your blog</p>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                                                <input
                                                    type="text"
                                                    value={settings.general.siteName}
                                                    onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                                                <input
                                                    type="email"
                                                    value={settings.general.adminEmail}
                                                    onChange={(e) => updateSetting('general', 'adminEmail', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                                            <textarea
                                                value={settings.general.siteDescription}
                                                onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                                                rows="3"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                            />
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Site URL</label>
                                                <input
                                                    type="url"
                                                    value={settings.general.siteUrl}
                                                    onChange={(e) => updateSetting('general', 'siteUrl', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                                                <select
                                                    value={settings.general.timezone}
                                                    onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                                                >
                                                    <option value="UTC">UTC</option>
                                                    <option value="America/New_York">Eastern Time</option>
                                                    <option value="America/Chicago">Central Time</option>
                                                    <option value="America/Denver">Mountain Time</option>
                                                    <option value="America/Los_Angeles">Pacific Time</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <button
                                            onClick={() => handleSave('General')}
                                            disabled={loading}
                                            className="btn btn-primary"
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Appearance Settings */}
                            {activeTab === 'appearance' && (
                                <div className="p-6">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Appearance Settings</h2>
                                        <p className="text-gray-600 text-sm">Customize the look and feel of your blog</p>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                                                <select
                                                    value={settings.appearance.theme}
                                                    onChange={(e) => updateSetting('appearance', 'theme', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                                                >
                                                    <option value="light">Light</option>
                                                    <option value="dark">Dark</option>
                                                    <option value="auto">Auto</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                                                <div className="flex items-center space-x-3">
                                                    <input
                                                        type="color"
                                                        value={settings.appearance.primaryColor}
                                                        onChange={(e) => updateSetting('appearance', 'primaryColor', e.target.value)}
                                                        className="w-12 h-10 border border-gray-300 rounded-md"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={settings.appearance.primaryColor}
                                                        onChange={(e) => updateSetting('appearance', 'primaryColor', e.target.value)}
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Custom CSS</label>
                                            <textarea
                                                value={settings.appearance.customCSS}
                                                onChange={(e) => updateSetting('appearance', 'customCSS', e.target.value)}
                                                rows="6"
                                                placeholder="/* Add your custom CSS here */"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-mono text-sm"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <button
                                            onClick={() => handleSave('Appearance')}
                                            disabled={loading}
                                            className="btn btn-primary"
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Content Settings */}
                            {activeTab === 'content' && (
                                <div className="p-6">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Content Settings</h2>
                                        <p className="text-gray-600 text-sm">Configure content management options</p>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Posts Per Page</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="50"
                                                    value={settings.content.postsPerPage}
                                                    onChange={(e) => updateSetting('content', 'postsPerPage', parseInt(e.target.value))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Default User Role</label>
                                                <select
                                                    value={settings.content.defaultUserRole}
                                                    onChange={(e) => updateSetting('content', 'defaultUserRole', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                                                >
                                                    <option value="viewer">Viewer</option>
                                                    <option value="author">Author</option>
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-900">Allow Comments</h4>
                                                    <p className="text-sm text-gray-500">Enable commenting on posts</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.content.allowComments}
                                                        onChange={(e) => updateSetting('content', 'allowComments', e.target.checked)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                </label>
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-900">Moderate Comments</h4>
                                                    <p className="text-sm text-gray-500">Require approval before comments are published</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.content.moderateComments}
                                                        onChange={(e) => updateSetting('content', 'moderateComments', e.target.checked)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                </label>
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-900">Allow Registration</h4>
                                                    <p className="text-sm text-gray-500">Allow new users to register</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.content.allowRegistration}
                                                        onChange={(e) => updateSetting('content', 'allowRegistration', e.target.checked)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <button
                                            onClick={() => handleSave('Content')}
                                            disabled={loading}
                                            className="btn btn-primary"
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Email Settings */}
                            {activeTab === 'email' && (
                                <div className="p-6">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Email Settings</h2>
                                        <p className="text-gray-600 text-sm">Configure SMTP settings for email notifications</p>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                                                <input
                                                    type="text"
                                                    value={settings.email.smtpHost}
                                                    onChange={(e) => updateSetting('email', 'smtpHost', e.target.value)}
                                                    placeholder="smtp.gmail.com"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                                                <input
                                                    type="number"
                                                    value={settings.email.smtpPort}
                                                    onChange={(e) => updateSetting('email', 'smtpPort', parseInt(e.target.value))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Username</label>
                                                <input
                                                    type="text"
                                                    value={settings.email.smtpUser}
                                                    onChange={(e) => updateSetting('email', 'smtpUser', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Password</label>
                                                <input
                                                    type="password"
                                                    value={settings.email.smtpPassword}
                                                    onChange={(e) => updateSetting('email', 'smtpPassword', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
                                                <input
                                                    type="email"
                                                    value={settings.email.fromEmail}
                                                    onChange={(e) => updateSetting('email', 'fromEmail', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
                                                <input
                                                    type="text"
                                                    value={settings.email.fromName}
                                                    onChange={(e) => updateSetting('email', 'fromName', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                            <button
                                                onClick={() => handleSave('Email')}
                                                disabled={loading}
                                                className="btn btn-primary"
                                            >
                                                {loading ? 'Saving...' : 'Save Changes'}
                                            </button>
                                            <button className="btn btn-outline">
                                                Test Email
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Security Settings */}
                            {activeTab === 'security' && (
                                <div className="p-6">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Security Settings</h2>
                                        <p className="text-gray-600 text-sm">Configure security and access control</p>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (hours)</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="168"
                                                    value={settings.security.sessionTimeout}
                                                    onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                                                <input
                                                    type="number"
                                                    min="3"
                                                    max="10"
                                                    value={settings.security.maxLoginAttempts}
                                                    onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Allowed File Types</label>
                                            <input
                                                type="text"
                                                value={settings.security.allowedFileTypes}
                                                onChange={(e) => updateSetting('security', 'allowedFileTypes', e.target.value)}
                                                placeholder="jpg,jpeg,png,gif,pdf"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Comma-separated list of allowed file extensions</p>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                                                    <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.security.enableTwoFactor}
                                                        onChange={(e) => updateSetting('security', 'enableTwoFactor', e.target.checked)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                </label>
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-900">Enable CAPTCHA</h4>
                                                    <p className="text-sm text-gray-500">Add CAPTCHA to login and registration forms</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.security.enableCaptcha}
                                                        onChange={(e) => updateSetting('security', 'enableCaptcha', e.target.checked)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <button
                                            onClick={() => handleSave('Security')}
                                            disabled={loading}
                                            className="btn btn-primary"
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Backup Settings */}
                            {activeTab === 'backup' && (
                                <div className="p-6">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Backup Settings</h2>
                                        <p className="text-gray-600 text-sm">Configure automatic backups and data retention</p>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                                                <select
                                                    value={settings.backup.backupFrequency}
                                                    onChange={(e) => updateSetting('backup', 'backupFrequency', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                                                >
                                                    <option value="daily">Daily</option>
                                                    <option value="weekly">Weekly</option>
                                                    <option value="monthly">Monthly</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Retention Days</label>
                                                <input
                                                    type="number"
                                                    min="7"
                                                    max="365"
                                                    value={settings.backup.retentionDays}
                                                    onChange={(e) => updateSetting('backup', 'retentionDays', parseInt(e.target.value))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900">Auto Backup</h4>
                                                <p className="text-sm text-gray-500">Automatically backup your data</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={settings.backup.autoBackup}
                                                    onChange={(e) => updateSetting('backup', 'autoBackup', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                        
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="text-sm font-medium text-gray-900 mb-2">Last Backup</h4>
                                            <p className="text-sm text-gray-600">
                                                {new Date(settings.backup.lastBackup).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                            <button
                                                onClick={() => handleSave('Backup')}
                                                disabled={loading}
                                                className="btn btn-primary"
                                            >
                                                {loading ? 'Saving...' : 'Save Changes'}
                                            </button>
                                            <button className="btn btn-outline">
                                                Create Backup Now
                                            </button>
                                            <button className="btn btn-secondary">
                                                Download Backup
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Settings;