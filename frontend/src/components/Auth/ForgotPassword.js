import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import brand from "../../assets/mr-icon.png";
import backgroundImage from "../../assets/bg.jpg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import "../../styles/ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // 1 = email step, 2 = reset step
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/forgot-password`,
        { email }
      );

      if (response.status === 200) {
        setSuccess(response.data.message || "OTP sent successfully!");
        setStep(2);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        "Failed to send OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    // Validation
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/verify-otp`,
        {
          email,
          otp,
          password: newPassword,
          confirm_password: confirmPassword
        }
      );

      if (response.status === 200) {
        setSuccess(response.data.message || "Password reset successfully!");
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        "Failed to reset password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="forgot-card">
        {/* Brand Header */}
        <div className="brand-header">
          <div className="brand">
            <img src={brand} alt="Brand Icon" className="brand-icon" />
            <h1 className="logo">
              My<span className="highlight"> Book </span>Shelf
            </h1>
          </div>
          <button className="back-button" onClick={() => navigate(-1)}>
            <FiArrowLeft />
          </button>
        </div>

        {step === 1 ? (
          <>
            <h2 className="forgot-title">Forgot Password?</h2>
            <p className="forgot-subtitle">
              Enter your email to receive a password reset OTP
            </p>

            <form className="forgot-form" onSubmit={handleSendOtp}>
              {/* Email Input */}
              <div className="input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field"
                />
              </div>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              {/* Send OTP Button */}
              <button 
                type="submit" 
                className="forgot-button"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </button>

              {/* Footer */}
              <div className="forgot-footer">
                <p>
                  Remember your password? <Link to="/login" className="footer-link">Login</Link>
                </p>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="forgot-title">Reset Password</h2>
            <p className="forgot-subtitle">
              Enter the OTP sent to {email} and your new password
            </p>

            <form className="forgot-form" onSubmit={handleResetPassword}>
              {/* OTP Input */}
              <div className="input-group">
                <label>OTP Code</label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="input-field"
                />
              </div>

              {/* New Password Input */}
              <div className="input-group">
                <label>New Password</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength="6"
                    className="input-field"
                  />
                  <span
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="input-group">
                <label>Confirm Password</label>
                <div className="password-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength="6"
                    className="input-field"
                  />
                  <span
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              {/* Reset Button */}
              <button 
                type="submit" 
                className="forgot-button"
                disabled={isLoading}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>

              {/* Back to email button */}
              <button 
                type="button" 
                className="secondary-button"
                onClick={() => {
                  setStep(1);
                  setError("");
                  setSuccess("");
                }}
                disabled={isLoading}
              >
                Back to Email
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;