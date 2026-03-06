import React, { useState, useEffect } from 'react';
import axios from "axios";
import './Orders.css';
import { useNavigate } from 'react-router-dom';
function AllOrders() {
     const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    const getAllOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get(`${API_URL}/api/orders/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(data);
            setOrders(data);
        } catch (e) {
            console.error('خطأ:', e);
            setError('فشل في تحميل الطلبات');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
    getAllOrders();
}, []);
    return (
        <>
        </>
    )
}

export default AllOrders