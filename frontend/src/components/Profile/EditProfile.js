import React, { useState } from 'react';
import { FiUser, FiEdit, FiLock, FiMail, FiBell, FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';
import '../../styles/EditProfile.css';

const EditProfile = () => {
  // Sample user data
  const [userData, setUserData] = useState({
    name: "Alex Johnson",
    email: "alex.j@example.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    notifications: {
      email: true,
      push: false,
      newsletter: true
    },
    privacy: {
      profileVisible: true,
      searchIndexing: false
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setUserData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setUserData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSave = () => {
    console.log("Saved data:", userData);
    setIsEditing(false);
    // Add your save logic/API call here
  };

  return (
    <div className="account-settings-container">
      <div className="settings-header">
        <h1><FiUser /> Account Settings</h1>
        {isEditing ? (
          <div className="action-buttons-p">
            <button className="cancel-btn" onClick={() => setIsEditing(false)}>
              <FiX /> Cancel
            </button>
            <button className="save-btn" onClick={handleSave}>
              <FiCheck /> Save Changes
            </button>
          </div>
        ) : (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            <FiEdit /> Edit 
          </button>
        )}
      </div>

      <div className="settings-tabs">

        <button 
          className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          Security
        </button>
        <button 
          className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
        <button 
          className={`tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
          onClick={() => setActiveTab('privacy')}
        >
          Privacy
        </button>
      </div>

      <div className="settings-content">
        {activeTab === 'general'}

        {activeTab === 'security' && (
          <div className="settings-section">
            <h2><FiLock /> Password & Security</h2>
            {isEditing ? (
              <>
                <div className="form-group">
                  <label>Current Password</label>
                  <div className="password-input">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={userData.currentPassword}
                      onChange={handleInputChange}
                      placeholder="Enter current password"
                    />
                    <button 
                      className="toggle-password"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <div className="password-input">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={userData.newPassword}
                      onChange={handleInputChange}
                      placeholder="Enter new password"
                    />
                    <button 
                      className="toggle-password"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <div className="password-input">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={userData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm new password"
                    />
                    <button 
                      className="toggle-password"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="security-status">
                <div className="status-item">
                  <div className="status-icon secure">
                    <FiCheck />
                  </div>
                  <span>Password last changed: 3 months ago</span>
                </div>
                <button 
                  className="change-password-btn"
                  onClick={() => {
                    setActiveTab('security');
                    setIsEditing(true);
                  }}
                >
                  Change Password
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="settings-section">
            <h2><FiBell /> Notification Preferences</h2>
            <div className="toggle-group">
              <label className="toggle-item">
                <input
                  type="checkbox"
                  name="notifications.email"
                  checked={userData.notifications.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <span className="toggle-label">Email Notifications</span>
                <span className="toggle-switch"></span>
              </label>

              <label className="toggle-item">
                <input
                  type="checkbox"
                  name="notifications.push"
                  checked={userData.notifications.push}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <span className="toggle-label">Push Notifications</span>
                <span className="toggle-switch"></span>
              </label>

              <label className="toggle-item">
                <input
                  type="checkbox"
                  name="notifications.newsletter"
                  checked={userData.notifications.newsletter}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <span className="toggle-label">Monthly Newsletter</span>
                <span className="toggle-switch"></span>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="settings-section">
            <h2>Privacy Settings</h2>
            <div className="toggle-group">
              <label className="toggle-item">
                <input
                  type="checkbox"
                  name="privacy.profileVisible"
                  checked={userData.privacy.profileVisible}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <span className="toggle-label">Make Profile Public</span>
                <span className="toggle-switch"></span>
              </label>

              <label className="toggle-item">
                <input
                  type="checkbox"
                  name="privacy.searchIndexing"
                  checked={userData.privacy.searchIndexing}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <span className="toggle-label">Allow Search Engine Indexing</span>
                <span className="toggle-switch"></span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfile;