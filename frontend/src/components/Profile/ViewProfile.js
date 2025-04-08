import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiUser, FiEdit, FiSave, FiX, FiCamera, FiMail, FiPhone, FiMapPin
} from 'react-icons/fi';
import '../../styles/ViewProfile.css';

const ModernProfile360 = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempUser, setTempUser] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

const token = localStorage.getItem('authToken');
useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = res.data;

      const baseURL = `${process.env.REACT_APP_BACKEND_URL}/`;
      const formattedUser = {
        ...userData,
        avatar: userData.avatar ? baseURL + userData.avatar : '',
        coverPhoto: userData.coverPhoto ? baseURL + userData.coverPhoto : '',
      };

      setUser(formattedUser);
      setTempUser(formattedUser);
      localStorage.setItem('user', JSON.stringify(formattedUser));
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  fetchProfile();
}, [token]);


  const handleEditClick = () => {
    setTempUser({ ...user });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAvatarFile(null);
    setCoverFile(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempUser(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      if (type === 'avatar') {
        setAvatarFile(file);
        setTempUser(prev => ({ ...prev, avatar: preview }));
      } else {
        setCoverFile(file);
        setTempUser(prev => ({ ...prev, coverPhoto: preview }));
      }
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('name', tempUser.name || '');
    formData.append('username', tempUser.username || '');
    formData.append('bio', tempUser.bio || '');
    formData.append('email', tempUser.email || '');
    formData.append('phone', tempUser.phone || '');
    formData.append('location', tempUser.location || '');
    if (avatarFile) formData.append('avatar', avatarFile);
    if (coverFile) formData.append('cover', coverFile);
  
    try {
      const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/auth/user/edit`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const updatedUser = res.data.user;
      const baseURL = `${process.env.REACT_APP_BACKEND_URL}/`;
      const formattedUser = {
        ...updatedUser,
        avatar: updatedUser.avatar ? baseURL + updatedUser.avatar : '',
        coverPhoto: updatedUser.coverPhoto ? baseURL + updatedUser.coverPhoto : '',
      };
  
      setUser(formattedUser);
      setTempUser(formattedUser);
      localStorage.setItem('user', JSON.stringify(formattedUser));
      setIsEditing(false);
      setAvatarFile(null);
      setCoverFile(null);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };
  

  if (!tempUser) return <div className="loading">Loading...</div>;

  return (
    <main className="modern-profile-page">
      <section className="modern-cover-photo-container">
        {isEditing ? (
          <>
            <img 
              src={tempUser.coverPhoto} 
              alt="Cover preview" 
              className="modern-cover-photo"
            />
            <label className="modern-cover-upload-btn">
              <FiCamera className="icon" />
              <span>Update Cover</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleImageUpload(e, 'cover')}
                className="modern-hidden-input"
              />
            </label>
          </>
        ) : (
          <img src={user.coverPhoto} alt="Cover" className="modern-cover-photo" />
        )}
      </section>

      <section className="modern-profile-content">
        <div className="modern-avatar-container">
          {isEditing ? (
            <>
              <img 
                src={tempUser.avatar} 
                alt="Avatar preview" 
                className="modern-profile-avatar"
              />
              <label className="modern-avatar-upload-btn">
                <FiCamera className="icon" />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleImageUpload(e, 'avatar')}
                  className="modern-hidden-input"
                />
              </label>
            </>
          ) : (
            <img src={user.avatar} alt="Avatar" className="modern-profile-avatar" />
          )}
        </div>

        <div className="modern-profile-info">
          {isEditing ? (
            <>
              <input
                type="text"
                name="name"
                value={tempUser.name}
                onChange={handleChange}
                className="modern-edit-input modern-name-input"
              />
              <input
                type="text"
                name="username"
                value={tempUser.username}
                onChange={handleChange}
                className="modern-edit-input modern-username-input"
              />
              <textarea
                name="bio"
                value={tempUser.bio}
                onChange={handleChange}
                className="modern-edit-textarea"
                rows={3}
              />
            </>
          ) : (
            <>
              <h1 className="modern-profile-name">{user.name}</h1>
              <p className="modern-profile-username">{user.username}</p>
              <p className="modern-profile-bio">{user.bio}</p>
            </>
          )}

          <div className="modern-contact-info">
            <div className="modern-contact-item">
              <FiMail className="modern-contact-icon" />
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={tempUser.email}
                  onChange={handleChange}
                  className="modern-edit-input"
                />
              ) : (
                <span>{user.email}</span>
              )}
            </div>
            <div className="modern-contact-item">
              <FiPhone className="modern-contact-icon" />
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={tempUser.phone}
                  onChange={handleChange}
                  className="modern-edit-input"
                />
              ) : (
                <span>{user.phone}</span>
              )}
            </div>
            <div className="modern-contact-item">
              <FiMapPin className="modern-contact-icon" />
              {isEditing ? (
                <input
                  type="text"
                  name="location"
                  value={tempUser.location}
                  onChange={handleChange}
                  className="modern-edit-input"
                />
              ) : (
                <span>{user.location}</span>
              )}
            </div>
          </div>
        </div>

        <div className="modern-profile-actions">
          {isEditing ? (
            <>
              <button className="modern-cancel-btn" onClick={handleCancel}>
                <FiX className="icon" /> Cancel
              </button>
              <button className="modern-save-btn" onClick={handleSave}>
                <FiSave className="icon" /> Save Changes
              </button>
            </>
          ) : (
            <button className="modern-edit-btn" onClick={handleEditClick}>
              <FiEdit className="icon" /> Edit Profile
            </button>
          )}
        </div>
      </section>
    </main>
  );
};

export default ModernProfile360;
