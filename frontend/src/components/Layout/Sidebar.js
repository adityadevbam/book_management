import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiHome, FiBook, FiPlus, FiLogOut, FiUser, FiSettings } from "react-icons/fi";
import brand from "../../assets/mr-icon.png";
import "../../styles/Sidebar.css";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div 
      className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`} 
      onMouseEnter={() => setIsExpanded(true)} 
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Brand Logo and Name */}
      <div className="brand">
        <img src={brand} alt="Brand Icon" className="brand-icon" />
        {isExpanded && (
          <h1 className="logo">
            My <span className="highlight">Book</span> Shelf
          </h1>
        )}
      </div>

      <nav className="sidebar-menu">
        <NavLink to="/" className="sidebar-item">
          <FiHome className="icon" />
          {isExpanded && <span className="sidebar-text">Home</span>}
          <div className="tooltip">Home</div>
        </NavLink>
        
        <NavLink to="/collection" className="sidebar-item">
          <FiBook className="icon" />
          {isExpanded && <span className="sidebar-text">My Collection</span>}
          <div className="tooltip">My Collection</div>
        </NavLink>
        
        <NavLink to="/add" className="sidebar-item">
          <FiPlus className="icon" />
          {isExpanded && <span className="sidebar-text">Add New</span>}
          <div className="tooltip">Add New</div>
        </NavLink>
      </nav>

      {/* Account Settings and Logout */}
      <div className="sidebar-footer">
        <NavLink to="/account" className="sidebar-item">
          <FiUser className="icon" />
          {isExpanded && <span className="sidebar-text">Profile</span>}
          <div className="tooltip">Profile</div>
        </NavLink>
        
        <NavLink to="/settings" className="sidebar-item">
          <FiSettings className="icon" />
          {isExpanded && <span className="sidebar-text">Settings</span>}
          <div className="tooltip">Settings</div>
        </NavLink>
        
        <button className="logout-button sidebar-item" onClick={handleLogout}>
          <FiLogOut className="icon" />
          {isExpanded && <span className="sidebar-text">Logout</span>}
          <div className="tooltip">Logout</div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
