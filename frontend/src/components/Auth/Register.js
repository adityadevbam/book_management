import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import brand from "../../assets/mr-icon.png";
import backgroundImage from "../../assets/bg.jpg";
import "../../styles/Register.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Basic Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/register`, userData);

      if (response.status === 201) {
        setSuccessMessage("Registration successful! Redirecting...");
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (err) {
      if (err.response) {
        // Handle different error statuses
        switch (err.response.status) {
          case 400:
            setError(err.response.data.message || "Invalid registration data");
            break;
          case 409:
            setError("Email already exists. Please login instead.");
            break;
          case 500:
            setError("Server error. Please try again later.");
            break;
          default:
            setError("Registration failed. Please try again.");
        }
      } else if (err.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container-r" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="register-card-r">
        {/* Brand Header */}
        <div className="brand-header-r">
          <div className="brand-r">
            <img src={brand} alt="Brand Icon" className="brand-icon-r" />
            <h1 className="logo-r">
              My <span className="highlight-r">Book</span> Shelf
            </h1>
          </div>
          <button className="back-button-r" onClick={() => navigate(-1)}>
            <FiArrowLeft />
          </button>
        </div>

        <h2 className="register-title-r">Create an Account</h2>
        <p className="register-subtitle-r">Join our reading community</p>

        {/* Success Message */}
        {successMessage && (
          <div className="success-message-r">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message-r">
            {error}
            {error.includes("already exists") && (
              <Link to="/login" className="login-link-r"> Login here</Link>
            )}
          </div>
        )}

        <form className="register-form-r" onSubmit={handleSubmit}>
          <div className="input-group-r">
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="Enter your full name" 
              name="name"  
              required 
              value={formData.name} 
              onChange={handleChange} 
            />
          </div>

          <div className="input-group-r">
            <label>Email Address</label>
            <input
              type="email"
              name="email"  
              placeholder="username@gmail.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group-r">
            <label>Password (min 6 characters)</label>
            <div className="password-wrapper-r">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                required
                value={formData.password}
                onChange={handleChange}
                minLength="6"
              />
              <span
                className="toggle-password-r"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="input-group-r">
            <label>Confirm Password</label>
            <div className="password-wrapper-r">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                required
                onChange={handleChange}
                value={formData.confirmPassword}
                minLength="6"
              />
              <span
                className="toggle-password-r"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button 
            type="submit" 
            className="register-button-r" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="register-footer-r">
          <p>
            Already have an account? <Link to="/login" className="footer-link-r">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;