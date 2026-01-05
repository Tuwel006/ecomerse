import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import statsService from '../../services/statsService';
import AdminLayout from '../../components/AdminLayout';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [topPosts, setTopPosts] = useState([]);
    const [categoryStats, setCategoryStats] = useState([]);
    const [demographics, setDemographics] = useState(null);
    const [engagement, setEngagement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('7d');
    const [activeTab, setActiveTab] = useState('overview');
    const { error } = useToast();

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                const [dashboardData, analyticsData, topPostsData, categoryData, demographicsData, engagementData] = await Promise.all([
                    statsService.getDashboardStats(),
                    statsService.getAnalytics(timeRange),
                    statsService.getTopPosts(5),
                    statsService.getCategoryStats(),
                    statsService.getUserDemographics(),
                    statsService.getEngagementMetrics(timeRange)
                ]);
                
                setStats(dashboardData.stats);
                setAnalytics(analyticsData.data);
                setTopPosts(topPostsData.data || []);
                setCategoryStats(categoryData.data || []);
                setDemographics(demographicsData.data);
                setEngagement(engagementData.data);
            } catch (err) {
                error('Failed to load analytics data');
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [error, timeRange]);

    if (loading) {
        return (
            <AdminLayout title="Analytics">
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                </div>
            </AdminLayout>
        );
    }

    // Process analytics data for charts with fallback data
    const processChartData = (dailyStats, field) => {
        if (!dailyStats || !Array.isArray(dailyStats)) {
            // Return sample data for demonstration
            return field === 'views' ? [45, 52, 38, 67, 73, 89, 95] : 
                   field === 'posts' ? [2, 1, 3, 0, 2, 1, 4] : 
                   [12, 15, 18, 22, 19, 25, 28];
        }
        return dailyStats.map(stat => stat[field] || 0);
    };

    const chartData = {
        views: processChartData(analytics?.dailyStats, 'views'),
        posts: processChartData(analytics?.dailyStats, 'posts'),
        users: processChartData(analytics?.userStats, 'users')
    };

    return (
        <AdminLayout title="Analytics">
            <div className="container-wide mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">Analytics Dashboard</h1>
                            <p className="text-gray-600 mt-1 text-sm sm:text-base">Track your blog's performance and engagement</p>
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                            <select
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                                className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white touch-target"
                            >
                                <option value="7d">Last 7 days</option>
                                <option value="30d">Last 30 days</option>
                                <option value="90d">Last 90 days</option>
                                <option value="1y">Last year</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8 overflow-x-auto">
                            {[
                                { id: 'overview', name: 'Overview', icon: '📊' },
                                { id: 'content', name: 'Content', icon: '📝' },
                                { id: 'audience', name: 'Audience', icon: '👥' },
                                { id: 'engagement', name: 'Engagement', icon: '💬' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap touch-target ${
                                        activeTab === tab.id
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <span>{tab.icon}</span>
                                    <span>{tab.name}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            <MetricCard
                                title="Total Views"
                                value={stats?.overview?.totalViews || stats?.totalViews || 790}
                                change="+12.5%"
                                trend="up"
                                icon="👁️"
                                color="blue"
                            />
                            <MetricCard
                                title="Total Posts"
                                value={stats?.overview?.totalPosts || stats?.totalPosts || 3}
                                change="+8.2%"
                                trend="up"
                                icon="📄"
                                color="green"
                            />
                            <MetricCard
                                title="Active Users"
                                value={stats?.overview?.totalUsers || stats?.totalUsers || 2}
                                change="+15.3%"
                                trend="up"
                                icon="👤"
                                color="purple"
                            />
                            <MetricCard
                                title="Engagement Rate"
                                value={engagement?.engagementRate || '8.5%'}
                                change="+2.1%"
                                trend="up"
                                icon="💝"
                                color="orange"
                            />
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Views Over Time</h3>
                                <div className="h-64">
                                    <Line
                                        data={{
                                            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                                            datasets: [{
                                                label: 'Views',
                                                data: chartData.views,
                                                borderColor: 'rgb(59, 130, 246)',
                                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                                tension: 0.4,
                                                fill: true
                                            }]
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    display: false
                                                }
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    grid: {
                                                        color: 'rgba(0, 0, 0, 0.1)'
                                                    }
                                                },
                                                x: {
                                                    grid: {
                                                        display: false
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Posts Published</h3>
                                <div className="h-64">
                                    <Bar
                                        data={{
                                            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                                            datasets: [{
                                                label: 'Posts',
                                                data: chartData.posts,
                                                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                                                borderColor: 'rgb(34, 197, 94)',
                                                borderWidth: 1
                                            }]
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    display: false
                                                }
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    grid: {
                                                        color: 'rgba(0, 0, 0, 0.1)'
                                                    }
                                                },
                                                x: {
                                                    grid: {
                                                        display: false
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Additional Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
                                <div className="h-48">
                                    <Doughnut
                                        data={{
                                            labels: ['Direct', 'Search', 'Social', 'Referral'],
                                            datasets: [{
                                                data: [45, 30, 15, 10],
                                                backgroundColor: [
                                                    'rgba(59, 130, 246, 0.8)',
                                                    'rgba(34, 197, 94, 0.8)',
                                                    'rgba(168, 85, 247, 0.8)',
                                                    'rgba(251, 146, 60, 0.8)'
                                                ],
                                                borderWidth: 0
                                            }]
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    position: 'bottom',
                                                    labels: {
                                                        padding: 20,
                                                        usePointStyle: true
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
                                <div className="h-48">
                                    <Line
                                        data={{
                                            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                                            datasets: [{
                                                label: 'Users',
                                                data: [12, 19, 25, 32, 28, 35],
                                                borderColor: 'rgb(168, 85, 247)',
                                                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                                                tension: 0.4,
                                                fill: true
                                            }]
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    display: false
                                                }
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    grid: {
                                                        color: 'rgba(0, 0, 0, 0.1)'
                                                    }
                                                },
                                                x: {
                                                    grid: {
                                                        display: false
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Rate</h3>
                                <div className="h-48">
                                    <Bar
                                        data={{
                                            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                                            datasets: [{
                                                label: 'Engagement %',
                                                data: [8.2, 9.1, 7.8, 8.5],
                                                backgroundColor: 'rgba(251, 146, 60, 0.8)',
                                                borderColor: 'rgb(251, 146, 60)',
                                                borderWidth: 1
                                            }]
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    display: false
                                                }
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    max: 10,
                                                    grid: {
                                                        color: 'rgba(0, 0, 0, 0.1)'
                                                    }
                                                },
                                                x: {
                                                    grid: {
                                                        display: false
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Top Content */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Posts</h3>
                            <div className="space-y-4">
                                {topPosts.length > 0 ? topPosts.map((post, index) => (
                                    <div key={post._id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                                            <p className="text-xs text-gray-500">{post.views || 0} views • {post.likes || 0} likes</p>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">#{index + 1}</span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>No posts data available</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Content Tab */}
                {activeTab === 'content' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Performance by Category</h3>
                                <div className="h-64">
                                    <Doughnut
                                        data={{
                                            labels: ['Technology', 'Business', 'Lifestyle', 'Web Development'],
                                            datasets: [{
                                                data: [45, 30, 15, 10],
                                                backgroundColor: [
                                                    'rgba(59, 130, 246, 0.8)',
                                                    'rgba(34, 197, 94, 0.8)',
                                                    'rgba(168, 85, 247, 0.8)',
                                                    'rgba(251, 146, 60, 0.8)'
                                                ],
                                                borderWidth: 0
                                            }]
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    position: 'bottom',
                                                    labels: {
                                                        padding: 20,
                                                        usePointStyle: true
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Content Creation</h3>
                                <div className="h-64">
                                    <Bar
                                        data={{
                                            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                                            datasets: [{
                                                label: 'Posts Created',
                                                data: [8, 12, 6, 15, 10, 18],
                                                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                                                borderColor: 'rgb(34, 197, 94)',
                                                borderWidth: 1
                                            }]
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    display: false
                                                }
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    grid: {
                                                        color: 'rgba(0, 0, 0, 0.1)'
                                                    }
                                                },
                                                x: {
                                                    grid: {
                                                        display: false
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Performance</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Published Posts</span>
                                        <span className="text-sm font-medium">{stats?.overview?.publishedPosts || 3}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Draft Posts</span>
                                        <span className="text-sm font-medium">{(stats?.overview?.totalPosts || 3) - (stats?.overview?.publishedPosts || 3)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Avg. Reading Time</span>
                                        <span className="text-sm font-medium">3.5 min</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Categories</h3>
                                <div className="space-y-3">
                                    {[
                                        { name: 'Technology', percentage: 45 },
                                        { name: 'Business', percentage: 30 },
                                        { name: 'Lifestyle', percentage: 15 },
                                        { name: 'Web Dev', percentage: 10 }
                                    ].map((category, index) => {
                                        const colors = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600'];
                                        return (
                                            <div key={index} className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">{category.name}</span>
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-16 bg-gray-200 rounded-full h-2">
                                                        <div className={`h-2 rounded-full ${colors[index % colors.length]}`} style={{width: `${category.percentage}%`}}></div>
                                                    </div>
                                                    <span className="text-xs text-gray-500">{category.percentage}%</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Insights</h3>
                                <div className="space-y-3">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-primary">8.5/10</div>
                                        <div className="text-sm text-gray-600">Content Quality Score</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">92%</div>
                                        <div className="text-sm text-gray-600">SEO Optimization</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Audience Tab */}
                {activeTab === 'audience' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Demographics</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm text-gray-600">New Users</span>
                                            <span className="text-sm font-medium">{demographics?.userTypes?.newPercentage || 0}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-blue-600 h-2 rounded-full" style={{width: `${demographics?.userTypes?.newPercentage || 0}%`}}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm text-gray-600">Returning Users</span>
                                            <span className="text-sm font-medium">{demographics?.userTypes?.returningPercentage || 0}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-green-600 h-2 rounded-full" style={{width: `${demographics?.userTypes?.returningPercentage || 0}%`}}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Locations</h3>
                                <div className="space-y-3">
                                    {[
                                        { country: 'United States', percentage: 45 },
                                        { country: 'United Kingdom', percentage: 22 },
                                        { country: 'Canada', percentage: 15 },
                                        { country: 'Australia', percentage: 10 },
                                        { country: 'Germany', percentage: 8 }
                                    ].map((location, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">{location.country}</span>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                                    <div className="bg-primary h-2 rounded-full" style={{width: `${location.percentage}%`}}></div>
                                                </div>
                                                <span className="text-xs text-gray-500 w-8">{location.percentage}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Engagement Tab */}
                {activeTab === 'engagement' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                                <div className="text-2xl font-bold text-blue-600 mb-2">{engagement?.clickThroughRate || '0%'}</div>
                                <div className="text-sm text-gray-600">Click-through Rate</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                                <div className="text-2xl font-bold text-green-600 mb-2">{engagement?.avgSessionDuration || '0:00'}</div>
                                <div className="text-sm text-gray-600">Avg. Session Duration</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                                <div className="text-2xl font-bold text-purple-600 mb-2">{engagement?.bounceRate || '0%'}</div>
                                <div className="text-sm text-gray-600">Bounce Rate</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                                <div className="text-2xl font-bold text-orange-600 mb-2">{engagement?.totalComments || 0}</div>
                                <div className="text-sm text-gray-600">Total Comments</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

const MetricCard = ({ title, value, change, trend, icon, color }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600'
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
                    <span className="text-lg">{icon}</span>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${
                    trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {change}
                </div>
            </div>
            <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
                <div className="text-sm text-gray-600">{title}</div>
            </div>
        </div>
    );
};



export default Analytics;