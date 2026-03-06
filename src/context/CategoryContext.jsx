import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'; // ❌ كان ناقص!

const API_URL = import.meta.env.VITE_API_URL;

const CategoryContext = createContext(); 

// Hook لاستخدام الـ Context
export const useCategories = () => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error('useCategories must be used within CategoriesProvider');
    }
    return context;
};

export const CategoriesProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const getCategories = async () => {
        try {
            setLoading(true);

            const { data } = await axios.get(`${API_URL}/api/categories/`);

            setCategories(data);
            console.log('تم جلب التصنيفات:', data);

        } catch (e) {
            console.error('خطأ في جلب التصنيفات:', e);
        } finally {
            setLoading(false);
        }
    };

    // ❌ كان ناقص - استدعاء getCategories عند تحميل Component
    useEffect(() => {
        getCategories();
    }, []);

    const value = {
        categories,           // قائمة التصنيفات
        loading,             // حالة التحميل
    };

    return (
        <CategoryContext.Provider value={value}>
            {children}
        </CategoryContext.Provider>
    );
}

export default CategoryContext;