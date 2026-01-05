import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import StatsCard from '../../components/StatsCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/Button';
import * as statsService from '../../services/statsService';
import * as postService from '../../services/postService';
import * as userService from '../../services/userService';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch different data based on user role
      if (user.role === 'admin') {
        const [statsData, postsData, usersData] = await Promise.all([
          statsService.getDashboardStats(),
          postService.getRecentPosts(5),
          userService.getPendingUsers()
        ]);

        setStats(statsData.stats);
        setRecentPosts(postsData.posts);
        setPendingUsers(usersData.users);
      } else {
        // For authors, get their stats and posts
        const [userStats, postsData] = await Promise.all([
          statsService.getUserStats(),
          postService.getAllPosts({ published: 'all', limit: 5 })
        ]);

        setStats({
          overview: {
            totalPosts: userStats.stats.totalPosts,
            publishedPosts: userStats.stats.publishedPosts,
            totalViews: userStats.stats.totalViews,
            totalLikes: userStats.stats.totalLikes
          }
        });
        setRecentPosts(postsData.posts);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      await userService.approveUser(userId);
      fetchDashboardData();
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const isAdmin = user.role === 'admin';

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-4 text-gray-500 hover:text-gray-700 md:hidden"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user.name}!</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                }
              >
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Posts"
              value={stats?.overview?.totalPosts || 0}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              color="blue"
            />

            {isAdmin ? (
              <>
                <StatsCard
                  title="Total Users"
                  value={stats?.overview?.totalUsers || 0}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  }
                  color="green"
                />
                <StatsCard
                  title="Total Views"
                  value={stats?.overview?.totalViews || 0}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  }
                  color="purple"
                />
                <StatsCard
                  title="Pending Approvals"
                  value={stats?.overview?.pendingUsers || 0}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  color="yellow"
                />
              </>
            ) : (
              <>
                <StatsCard
                  title="Published"
                  value={stats?.overview?.publishedPosts || 0}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  color="green"
                />
                <StatsCard
                  title="Total Views"
                  value={stats?.overview?.totalViews || 0}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  }
                  color="purple"
                />
                <StatsCard
                  title="Total Likes"
                  value={stats?.overview?.totalLikes || 0}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  }
                  color="red"
                />
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Posts */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Recent Posts</h2>
                <Button variant="ghost" size="sm" onClick={() => navigate('/admin/posts')}>
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                {recentPosts.length > 0 ? (
                  recentPosts.map((post) => (
                    <div key={post._id} className="flex items-start space-x-3 pb-4 border-b border-gray-200 last:border-0">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 line-clamp-1">{post.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No posts yet</p>
                )}
              </div>
            </div>

            {/* Pending Users (Admin only) */}
            {isAdmin && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Pending Approvals</h2>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/admin/users')}>
                    View All
                  </Button>
                </div>

                <div className="space-y-4">
                  {pendingUsers.length > 0 ? (
                    pendingUsers.slice(0, 5).map((pendingUser) => (
                      <div key={pendingUser._id} className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-0">
                        <div>
                          <h3 className="font-medium text-gray-900">{pendingUser.name}</h3>
                          <p className="text-sm text-gray-500">{pendingUser.email}</p>
                          <span className="text-xs text-gray-400 capitalize">{pendingUser.role}</span>
                        </div>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleApproveUser(pendingUser._id)}
                        >
                          Approve
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No pending approvals</p>
                  )}
                </div>
              </div>
            )}

            {/* Quick Actions (Author view) */}
            {!isAdmin && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Button
                    fullWidth
                    variant="primary"
                    onClick={() => navigate('/newpost')}
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    }
                  >
                    Create New Post
                  </Button>
                  <Button
                    fullWidth
                    variant="secondary"
                    onClick={() => navigate('/admin/posts')}
                  >
                    Manage My Posts
                  </Button>
                  <Button
                    fullWidth
                    variant="ghost"
                    onClick={() => navigate('/')}
                  >
                    View Website
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
