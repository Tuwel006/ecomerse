import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await usersAPI.updateProfile(profile);
      if (result.success) {
        setEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your account information</p>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <h2>Personal Information</h2>
            <button 
              className="btn btn-sm btn-secondary"
              onClick={() => setEditing(!editing)}
            >
              {editing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                className="input"
                value={profile.name}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="input"
                value={profile.email}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                className="input"
                value={profile.phone}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                className="input"
                rows="3"
                value={profile.address}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            {editing && (
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </form>
        </div>

        <div className="card">
          <h2>Account Settings</h2>
          <div className="settings-list">
            <div className="setting-item">
              <h3>Change Password</h3>
              <p>Update your password to keep your account secure</p>
              <button className="btn btn-sm btn-secondary">Change Password</button>
            </div>
            
            <div className="setting-item">
              <h3>Email Notifications</h3>
              <p>Manage your email preferences</p>
              <button className="btn btn-sm btn-secondary">Manage</button>
            </div>
            
            <div className="setting-item">
              <h3>Delete Account</h3>
              <p>Permanently delete your account and all data</p>
              <button className="btn btn-sm btn-danger">Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;