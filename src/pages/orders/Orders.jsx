import React, { useState, useEffect } from 'react';
import axios from "axios";
import './Orders.css';
import { data, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(null);
    const navigate = useNavigate()
    const role = localStorage.getItem('role')

    const getOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get(`${API_URL}/api/orders/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(data)
            setOrders(data);
        } catch (e) {
            console.error('خطأ في جلب الطلبات:', e);

            if (e.response?.status === 401) {
                setError('انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(e.response?.data?.error || 'فشل في تحميل الطلبات');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            // تعيين المعرف للطلب الذي يتم تحديثه
            setUpdatingStatus(id);
            
            // إرسال الطلب لتحديث الحالة
            const { data } = await axios.patch(
                `${API_URL}/api/orders/${id}/update_status/`, 
                { "status": status },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            console.log('تم تحديث الحالة:', data);

            // تحديث الـ state مباشرة بدون الحاجة لإعادة جلب البيانات
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id === id 
                        ? { ...order, status: status }
                        : order
                )
            );
           console.log('تم تحديث الحالة بنجاح');

        } catch (e) {
            console.error('خطأ في تحديث الحالة:', e);

        } finally {
            setUpdatingStatus(null);
        }
    };

    useEffect(() => {
        getOrders();
    }, []);

    const getStatusText = (status) => {
        const statusMap = {
            'pending': 'قيد الانتظار',
            'processing': 'قيد المعالجة',
            'shipped': 'تم الشحن',
            'delivered': 'تم التوصيل',
            'completed': 'مكتمل',
            'cancelled': 'ملغي'
        };
        return statusMap[status] || status;
    };

    const getStatusIcon = (status) => {
        const iconMap = {
            'pending': '⏳',
            'processing': '⚙️',
            'shipped': '🚚',
            'delivered': '✅',
            'completed': '✅',
            'cancelled': '❌'
        };
        return iconMap[status] || '📦';
    };

    if (loading) {
        return (
            <div className="orders-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">جاري تحميل الطلبات...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="orders-container">
                <div className="error-container">
                    <div className="error-icon">⚠️</div>
                    <p className="error-text">{error}</p>
                    <button className="retry-btn" onClick={getOrders}>
                        إعادة المحاولة
                    </button>
                </div>
            </div>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="orders-container">
                <div className="empty-orders">
                    <div className="empty-icon">📦</div>
                    <h2>لا توجد طلبات حتى الآن</h2>
                    <p>ابدأ بالتسوق وأضف منتجات إلى سلة التسوق</p>
                    <button className="shop-now-btn" onClick={() => navigate('/products')}>
                        تسوق الآن
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-container" dir="rtl">
            <div className="orders-header">
                <h1 className="orders-title">
                    <span className="title-icon">🛍️</span>
                    طلباتي
                </h1>
                <p className="orders-subtitle">
                    عدد الطلبات: <span className="orders-count">{orders.length}</span>
                </p>
            </div>

            <div className="orders-grid">
                {orders.map((order) => (
                    <div key={order.id} className="order-card">
                        {/* Order Header */}
                        <div className="order-header">
                            <div className="order-info">
                                <h2 className="order-number">
                                    <span className="hash-icon">#</span>
                                    {order.id}
                                </h2>
                                {role === 'manager' && order.user && (
                                    <p className="order-customer">
                                        <span className="customer-icon">👤</span>
                                        العميل: <strong>{order.user.username}</strong>
                                    </p>
                                )}
                                <p className="order-date">
                                    <span className="date-icon">📅</span>
                                    {new Date(order.created_at).toLocaleDateString('ar-EG', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                                <p className="order-time">
                                    <span className="time-icon">🕐</span>
                                    {new Date(order.created_at).toLocaleTimeString('ar-EG', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <div className={`order-status status-${order.status}`}>
                                <span className="status-icon">{getStatusIcon(order.status)}</span>
                                <span className="status-text">{getStatusText(order.status)}</span>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="order-items">
                            <h3 className="items-title">
                                <span className="items-icon">📦</span>
                                المنتجات ({order.items.length})
                            </h3>
                            {order.items.map((item) => (
                                <div key={item.id} className="order-item">
                                    <div className="item-details">
                                        <h4 className="item-name">{item.productName}</h4>
                                        <div className="item-meta">
                                            <span className="item-quantity">
                                                <span className="quantity-icon">🔢</span>
                                                الكمية: <strong>{item.quantity}</strong>
                                            </span>
                                            <span className="item-price">
                                                <span className="price-icon">💰</span>
                                                السعر: <strong>{parseFloat(item.price).toFixed(2)} ₪</strong>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="item-total">
                                        <p className="total-label">المجموع</p>
                                        <p className="total-value">
                                            {(parseFloat(item.price) * item.quantity).toFixed(2)} ₪
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Address Details Section */}
                        <div className="order-address-section">
                            <h3 className="address-section-title">
                                <span className="address-icon">📍</span>
                                عنوان التوصيل
                            </h3>
                            <div className="address-content">
                                <div className="address-box">
                                    <p className="address-text">
                                        <span className="address-label">العنوان الكامل:</span>
                                        <span className="address-value">{order.address_data.fullName}</span>
                                        <span className="address-value">{order.address_data.phone}</span>
                                        <span className="address-value">{order.address_data.city}-{order.address_data.street}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Order Footer */}
                        <div className="order-footer">
                            <div className="order-summary">
                                <span className="summary-label">المجموع الكلي</span>
                                <span className="summary-value">
                                    {parseFloat(order.total).toFixed(2)} <span className="currency">₪</span>
                                </span>
                            </div>
                            {role === 'manager' && (
                                <div className="status-change-container">
                                    <label className="status-change-label">
                                        <span className="change-icon">🔄</span>
                                        تغيير الحالة:
                                    </label>
                                    <select
                                        className="status-dropdown"
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        disabled={updatingStatus === order.id || order.status=="cancelled"}
                                    >
                                        <option value="pending">⏳ قيد الانتظار</option>
                                        <option value="processing">⚙️ قيد المعالجة</option>
                                        <option value="shipped">🚚 تم الشحن</option>
                                        <option value="delivered">✅ تم التوصيل</option>
                                        <option value="completed">✅ مكتمل</option>
                                        <option value="cancelled">❌ ملغي</option>
                                    </select>
                                    {updatingStatus === order.id && (
                                        <span className="updating-spinner">⏳ جاري التحديث...</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Orders;