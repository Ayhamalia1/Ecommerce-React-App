import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../../context/CategoryContext';
import './NewProduct.css';

const API_URL = import.meta.env.VITE_API_URL;

function NewProduct() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const { categories, loading: categoriesLoading } = useCategories();

    // State للمنتج
    const [product, setProduct] = useState({
        name: '',
        descreption: '',
        price: '',
        category: '',
        stock: '',
        image: null
        
    });

    // State لمعاينة الصورة
    const [imagePreview, setImagePreview] = useState(null);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: value
        }));
        // إزالة رسالة الخطأ عند التعديل
        if (error) setError(null);
    };

    // Handle image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        
        if (file) {
            // التحقق من نوع الملف
            if (!file.type.startsWith('image/')) {
                setError('يرجى اختيار صورة صالحة');
                return;
            }

            // التحقق من حجم الملف (مثلاً 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
                return;
            }

            setProduct(prev => ({
                ...prev,
                image: file
            }));

            // إنشاء معاينة للصورة
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove image
    const handleRemoveImage = () => {
        setProduct(prev => ({
            ...prev,
            image: null
        }));
        setImagePreview(null);
    };

    // Validate form
    const validateForm = () => {
        if (!product.name.trim()) {
            setError('اسم المنتج مطلوب');
            return false;
        }
        if (!product.descreption.trim()) {
            setError('وصف المنتج مطلوب');
            return false;
        }
        if (!product.price || parseFloat(product.price) <= 0) {
            setError('السعر يجب أن يكون أكبر من صفر');
            return false;
        }
        if (!product.category) {
            setError('يرجى اختيار التصنيف');
            return false;
        }
        if (!product.stock || parseInt(product.stock) < 0) {
            setError('الكمية يجب أن تكون صفر أو أكبر');
            return false;
        }
        if (!product.image) {
            setError('يرجى اختيار صورة للمنتج');
            return false;
        }
        return true;
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // إنشاء FormData لإرسال الملفات
            const formData = new FormData();
            formData.append('name', product.name);
            formData.append('descreption', product.descreption);
            formData.append('price', product.price);
            formData.append('category', product.category);
            formData.append('stock', product.stock);
            formData.append('image', product.image);

            // إرسال الطلب
            const { data } = await axios.post(
                `${API_URL}/api/products/`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            console.log('تم إضافة المنتج بنجاح:', data);

            // إظهار رسالة نجاح
            setSuccessMessage('تم إضافة المنتج بنجاح! ✅');

            // إعادة تعيين النموذج
            setProduct({
                name: '',
                descreption: '',
                price: '',
                category: '',
                stock: '',
                image: null
            });
            setImagePreview(null);


        } catch (e) {
            console.error('خطأ في إضافة المنتج:', e);
            
            if (e.response?.status === 401) {
                setError('انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى');
                setTimeout(() => navigate('/login'), 2000);
            } else if (e.response?.status === 403) {
                setError('ليس لديك صلاحية لإضافة منتجات');
            } else {
                setError(e.response?.data?.message || 'فشل في إضافة المنتج. حاول مرة أخرى');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="new-product-container" dir="rtl">
            <div className="new-product-header">
                <button 
                    className="back-btn"
                    onClick={() => navigate(-1)}
                >
                    <span className="back-icon">←</span>
                    رجوع
                </button>
                <h1 className="page-title">
                    <span className="title-icon">➕</span>
                    إضافة منتج جديد
                </h1>
            </div>



            {/* Error Message */}
            {error && (
                <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {error}
                </div>
            )}

            <form className="product-form" onSubmit={handleSubmit}>
                {/* Product Image Upload */}
                <div className="form-section image-section">
                    <h3 className="section-title">
                        <span className="section-icon">🖼️</span>
                        صورة المنتج
                    </h3>
                    
                    <div className="image-upload-area">
                        {imagePreview ? (
                            <div className="image-preview-container">
                                <img 
                                    src={imagePreview} 
                                    alt="معاينة المنتج" 
                                    className="image-preview"
                                />
                                <button
                                    type="button"
                                    className="remove-image-btn"
                                    onClick={handleRemoveImage}
                                >
                                    <span className="remove-icon">🗑️</span>
                                    إزالة الصورة
                                </button>
                            </div>
                        ) : (
                            <label className="image-upload-label">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="image-input"
                                />
                                <div className="upload-placeholder">
                                    <span className="upload-icon">📷</span>
                                    <p className="upload-text">اضغط لاختيار صورة</p>
                                    <p className="upload-hint">JPG, PNG (حد أقصى 5MB)</p>
                                </div>
                            </label>
                        )}
                    </div>
                </div>

                {/* Product Details */}
                <div className="form-section details-section">
                    <h3 className="section-title">
                        <span className="section-icon">📝</span>
                        تفاصيل المنتج
                    </h3>

                    {/* Product Name */}
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">
                            <span className="label-icon">🏷️</span>
                            اسم المنتج
                            <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="أدخل اسم المنتج"
                            required
                        />
                    </div>

                    {/* Product descreption */}
                    <div className="form-group">
                        <label htmlFor="descreption" className="form-label">
                            <span className="label-icon">📄</span>
                            وصف المنتج
                            <span className="required">*</span>
                        </label>
                        <textarea
                            id="descreption"
                            name="descreption"
                            value={product.descreption}
                            onChange={handleChange}
                            className="form-textarea"
                            placeholder="أدخل وصف تفصيلي للمنتج"
                            rows="5"
                            required
                        />
                    </div>

                    {/* Price and Stock Row */}
                    <div className="form-row">
                        {/* Price */}
                        <div className="form-group">
                            <label htmlFor="price" className="form-label">
                                <span className="label-icon">💰</span>
                                السعر (₪)
                                <span className="required">*</span>
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={product.price}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>

                        {/* Stock */}
                        <div className="form-group">
                            <label htmlFor="stock" className="form-label">
                                <span className="label-icon">📦</span>
                                الكمية المتوفرة
                                <span className="required">*</span>
                            </label>
                            <input
                                type="number"
                                id="stock"
                                name="stock"
                                value={product.stock}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="0"
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div className="form-group">
                        <label htmlFor="category" className="form-label">
                            <span className="label-icon">🏪</span>
                            التصنيف
                            <span className="required">*</span>
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={product.category}
                            onChange={handleChange}
                            className="form-select"
                            disabled={categoriesLoading}
                            required
                        >
                            <option value="">
                                {categoriesLoading ? 'جاري التحميل...' : 'اختر التصنيف'}
                            </option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="form-actions">
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => navigate(-1)}
                        disabled={loading}
                    >
                        <span className="btn-icon">❌</span>
                        إلغاء
                    </button>
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading-spinner"></span>
                                جاري الإضافة...
                            </>
                        ) : (
                            <>
                                <span className="btn-icon">✅</span>
                                إضافة المنتج
                            </>
                        )}
                    </button>
                </div>
                            {/* Success Message */}
            {successMessage && (
                <div className="success-message">
                    <span className="success-icon">✅</span>
                    {successMessage}
                </div>
            )}
            </form>
        </div>
    );
}

export default NewProduct;