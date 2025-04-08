import brand from "../../assets/mr-icon.png";
import backgroundImage from "../../assets/bg.jpg";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/Login.css";
import axios from "axios";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const successMessage = location.state?.message;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.email || !formData.password) {
            setError("Please fill in all Details");
            return;
        }

        setIsLoading(true);

        const userData = {
            email: formData.email,
            password: formData.password
        };

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, userData);

            if (response.status === 200) {
                localStorage.setItem("authToken", response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/');
            }
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || 'Login Failed');
            } else if (err.request) {
                setError("No response from server, Please try again");
            } else {
                setError("An error occured. Please try again");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container-l" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="login-card-l">
                {/* Brand Header */}
                <div className="brand-header-l">
                    <div className="brand-l">
                        <img src={brand} alt="Brand Icon" className="brand-icon-l" />
                        <h1 className="logo-l">
                            My <span className="highlight-l">Book</span> Shelf
                        </h1>
                    </div>
                    <button className="back-button-l" onClick={() => navigate(-1)}>
                        <FiArrowLeft />
                    </button>
                </div>

                <h2 className="login-title-l">Welcome Back</h2>
                <p className="login-subtitle-l">Please login to continue</p>

                <form className="login-form-l" onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div className="input-group-l">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            required
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    
                    {/* Password Input */}
                    <div className="input-group-l">
                        <div className="password-label-container">
                            <label>Password</label>
                            <Link to="/forgot-password" className="forgot-password-link">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="password-wrapper-l">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                required
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <span
                                className="toggle-password-l"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{cursor:"pointer"}}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && <div className="error-message">{error}</div>}

                    {/* Login Button */}
                    <button 
                        className="login-button-l"
                        type="submit"
                        disabled={isLoading}
                        style={{
                            backgroundColor: isLoading ? "#cccccc" : '#fa7c54',
                            cursor: isLoading ? 'not-allowed' : "pointer" 
                        }}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* Sign Up Section */}
                <div className="signup-section">
                    <p>Don't have an account? <Link to="/register" className="signup-link">Sign up</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;