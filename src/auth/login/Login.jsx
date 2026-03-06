import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import './Login.css';

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
    const [user, setUser] = useState({
        username: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function formHandle(e) {
        let { name, value } = e.target;
        setUser({
            ...user, 
            [name]: value
        });
    }

    const SubmitHandle = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!user.username.trim() || !user.password.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'تنبيه',
                text: 'يرجى ملء جميع الحقول',
                confirmButtonColor: '#1e3c72'
            });
            return;
        }

        try {
            setLoading(true);
            
            const response = await axios.post(`${API_URL}/api/auth/token/`, user);
            
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('role', response.data.user.role);
            window.dispatchEvent(new Event('storage'));

            // Success message
            Swal.fire({
                icon: 'success',
                title: 'تم تسجيل الدخول!',
                text: 'مرحباً بك',
                confirmButtonColor: '#4caf50',
                timer: 1500,
                timerProgressBar: true
            });

            setTimeout(() => {
                navigate('/');
            }, 1500);

        } catch (error) {
            console.error('Login error:', error);
            
            Swal.fire({
                icon: 'error',
                title: 'فشل تسجيل الدخول',
                text: 'اسم المستخدم أو كلمة المرور غير صحيحة',
                confirmButtonColor: '#1e3c72'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-background">
                {/* Animated circles background */}
                <div className="circle circle-1"></div>
                <div className="circle circle-2"></div>
                <div className="circle circle-3"></div>
            </div>

            <div className="login-content">
                <div className="login-card">
                    {/* Header */}
                    <div className="login-header">
                        <div className="login-icon">
                            <FontAwesomeIcon icon={faSignInAlt} />
                        </div>
                        <h1 className="login-title">تسجيل الدخول</h1>
                        <p className="login-subtitle">مرحباً بعودتك! قم بتسجيل الدخول لحسابك</p>
                    </div>

                    {/* Form */}
                    <form className="login-form" onSubmit={SubmitHandle}>
                        {/* Username Field */}
                        <div className="form-group">
                            <label htmlFor="username" className="form-label">
                                <FontAwesomeIcon icon={faUser} className="label-icon" />
                                اسم المستخدم
                            </label>
                            <div className="input-wrapper">
                                <span className="input-icon">
                                    <FontAwesomeIcon icon={faUser} />
                                </span>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={user.username}
                                    onChange={formHandle}
                                    className="form-input"
                                    placeholder="أدخل اسم المستخدم"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                <FontAwesomeIcon icon={faLock} className="label-icon" />
                                كلمة المرور
                            </label>
                            <div className="input-wrapper">
                                <span className="input-icon">
                                    <FontAwesomeIcon icon={faLock} />
                                </span>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={user.password}
                                    onChange={formHandle}
                                    className="form-input"
                                    placeholder="أدخل كلمة المرور"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="form-options">
                            <label className="remember-me">
                                <input type="checkbox" />
                                <span>تذكرني</span>
                            </label>
                            <a href="#" className="forgot-password">نسيت كلمة المرور؟</a>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            className="login-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="btn-spinner"></span>
                                    جاري تسجيل الدخول...
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faSignInAlt} className="btn-icon" />
                                    تسجيل الدخول
                                </>
                            )}
                        </button>

                        {/* Register Link */}
                        <div className="register-link">
                            ليس لديك حساب؟ 
                            <a href="/register"> سجل الآن</a>
                        </div>
                    </form>
                </div>

                {/* Side Image/Content */}
                <div className="login-side">
                    <div className="side-content">
                        <h2 className="side-title">مرحباً بك في متجرنا</h2>
                        <p className="side-text">
                            اكتشف أفضل المنتجات بأفضل الأسعار. 
                            قم بتسجيل الدخول للوصول إلى حسابك والاستمتاع بتجربة تسوق مميزة.
                        </p>
                        <div className="side-features">
                            <div className="feature-item">
                                <span className="feature-icon">✓</span>
                                <span className="feature-text">منتجات عالية الجودة</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">✓</span>
                                <span className="feature-text">شحن سريع</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">✓</span>
                                <span className="feature-text">دعم فني متواصل</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;