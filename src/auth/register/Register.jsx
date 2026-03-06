import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUser, 
    faEnvelope, 
    faLock, 
    faUserPlus,
    faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import './Register.css';

const API_URL = import.meta.env.VITE_API_URL;

function Register() {
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        password2: "",
    });
    const [loading, setLoading] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const navigate = useNavigate();

    function formHandle(e) {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value,
        });

        // Check password match
        if (name === 'password2' || name === 'password') {
            if (name === 'password2') {
                setPasswordMatch(value === user.password);
            } else {
                setPasswordMatch(user.password2 === value);
            }
        }
    }

    const validateForm = () => {
        if (!user.username.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'تنبيه',
                text: 'يرجى إدخال اسم المستخدم',
                confirmButtonColor: '#1e3c72'
            });
            return false;
        }

        if (!user.email.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'تنبيه',
                text: 'يرجى إدخال البريد الإلكتروني',
                confirmButtonColor: '#1e3c72'
            });
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.email)) {
            Swal.fire({
                icon: 'warning',
                title: 'تنبيه',
                text: 'البريد الإلكتروني غير صحيح',
                confirmButtonColor: '#1e3c72'
            });
            return false;
        }

        if (!user.password.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'تنبيه',
                text: 'يرجى إدخال كلمة المرور',
                confirmButtonColor: '#1e3c72'
            });
            return false;
        }

        if (user.password.length < 8) {
            Swal.fire({
                icon: 'warning',
                title: 'تنبيه',
                text: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
                confirmButtonColor: '#1e3c72'
            });
            return false;
        }

        if (user.password !== user.password2) {
            Swal.fire({
                icon: 'warning',
                title: 'تنبيه',
                text: 'كلمات المرور غير متطابقة',
                confirmButtonColor: '#1e3c72'
            });
            return false;
        }

        return true;
    };

    const SubmitHandle = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(`${API_URL}/api/auth/register/`, user);

            Swal.fire({
                icon: 'success',
                title: 'تم التسجيل بنجاح!',
                text: 'سيتم تحويلك لصفحة تسجيل الدخول',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
                confirmButtonColor: '#4caf50'
            });

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            console.error('Registration error:', error);

            if (error.response) {
                const data = error.response.data;
                const firstKey = Object.keys(data)[0];
                const firstMessage = data[firstKey][0];
                
                Swal.fire({
                    icon: 'error',
                    title: 'فشل التسجيل!',
                    text: firstMessage,
                    confirmButtonColor: '#1e3c72'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'فشل التسجيل!',
                    text: 'حدث خطأ. يرجى المحاولة مرة أخرى',
                    confirmButtonColor: '#1e3c72'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-background">
                <div className="circle circle-1"></div>
                <div className="circle circle-2"></div>
                <div className="circle circle-3"></div>
            </div>

            <div className="register-content">
                {/* Side Content */}
                <div className="register-side">
                    <div className="side-content">
                        <h2 className="side-title">انضم إلينا اليوم</h2>
                        <p className="side-text">
                            أنشئ حساباً جديداً واستمتع بتجربة تسوق فريدة مع عروض حصرية ومزايا خاصة للأعضاء.
                        </p>
                        <div className="side-features">
                            <div className="feature-item">
                                <span className="feature-icon">✓</span>
                                <span className="feature-text">عروض حصرية للأعضاء</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">✓</span>
                                <span className="feature-text">تتبع طلباتك بسهولة</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">✓</span>
                                <span className="feature-text">قوائم الرغبات المفضلة</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">✓</span>
                                <span className="feature-text">دعم فني 24/7</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Register Card */}
                <div className="register-card">
                    <div className="register-header">
                        <div className="register-icon">
                            <FontAwesomeIcon icon={faUserPlus} />
                        </div>
                        <h1 className="register-title">إنشاء حساب جديد</h1>
                        <p className="register-subtitle">املأ البيانات أدناه للتسجيل</p>
                    </div>

                    <form className="register-form" onSubmit={SubmitHandle}>
                        {/* Username */}
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
                                    placeholder="اختر اسم مستخدم"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                <FontAwesomeIcon icon={faEnvelope} className="label-icon" />
                                البريد الإلكتروني
                            </label>
                            <div className="input-wrapper">
                                <span className="input-icon">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </span>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={user.email}
                                    onChange={formHandle}
                                    className="form-input"
                                    placeholder="example@email.com"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password */}
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
                                    placeholder="8 أحرف على الأقل"
                                    disabled={loading}
                                />
                            </div>
                            {user.password && user.password.length > 0 && (
                                <div className="password-strength">
                                    <div className={`strength-bar ${
                                        user.password.length < 8 ? 'weak' : 
                                        user.password.length < 12 ? 'medium' : 'strong'
                                    }`}></div>
                                    <span className="strength-text">
                                        {user.password.length < 8 ? 'ضعيفة' : 
                                         user.password.length < 12 ? 'متوسطة' : 'قوية'}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="form-group">
                            <label htmlFor="password2" className="form-label">
                                <FontAwesomeIcon icon={faCheckCircle} className="label-icon" />
                                تأكيد كلمة المرور
                            </label>
                            <div className="input-wrapper">
                                <span className="input-icon">
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                </span>
                                <input
                                    type="password"
                                    id="password2"
                                    name="password2"
                                    value={user.password2}
                                    onChange={formHandle}
                                    className={`form-input ${
                                        user.password2 && !passwordMatch ? 'error' : ''
                                    } ${
                                        user.password2 && passwordMatch && user.password2.length > 0 ? 'success' : ''
                                    }`}
                                    placeholder="أعد إدخال كلمة المرور"
                                    disabled={loading}
                                />
                                {user.password2 && passwordMatch && user.password2.length > 0 && (
                                    <span className="input-check success">✓</span>
                                )}
                                {user.password2 && !passwordMatch && (
                                    <span className="input-check error">✗</span>
                                )}
                            </div>
                            {user.password2 && !passwordMatch && (
                                <span className="error-message">كلمات المرور غير متطابقة</span>
                            )}
                        </div>

                        {/* Terms */}
                        <div className="terms-checkbox">
                            <label>
                                <input type="checkbox" required />
                                <span>
                                    أوافق على 
                                    <a href="/terms"> الشروط والأحكام</a>
                                    و
                                    <a href="/privacy"> سياسة الخصوصية</a>
                                </span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            className="register-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="btn-spinner"></span>
                                    جاري التسجيل...
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faUserPlus} className="btn-icon" />
                                    إنشاء حساب
                                </>
                            )}
                        </button>

                        {/* Login Link */}
                        <div className="login-link">
                            لديك حساب بالفعل؟ 
                            <a href="/login"> سجل الدخول</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;