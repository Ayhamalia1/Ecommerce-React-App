import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Link } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./AutoSwiper.css";

function AutoSwiper() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/api/products/`);
      console.log(data);
      
      // أخذ أول 5 منتجات فقط للعرض في السلايدر
      const featuredProducts = data.results?.slice(0, 5) || [];
      setProducts(featuredProducts);
      setError(null);
    } catch (error) {
      console.log(error);
      setError('فشل تحميل المنتجات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // حالة التحميل
  if (loading) {
    return (
      <div className="swiper-loading">
        <div className="loading-spinner"></div>
        <p className="loading-text">جاري تحميل المنتجات...</p>
      </div>
    );
  }

  // حالة الخطأ
  if (error) {
    return (
      <div className="swiper-error">
        <span className="error-icon">⚠️</span>
        <p className="error-text">{error}</p>
        <button className="retry-btn" onClick={getProducts}>
          إعادة المحاولة
        </button>
      </div>
    );
  }

  // حالة عدم وجود منتجات
  if (!products || products.length === 0) {
    return (
      <div className="swiper-empty">
        <span className="empty-icon">📦</span>
        <p className="empty-text">لا توجد منتجات للعرض حالياً</p>
      </div>
    );
  }

  return (
    <Swiper
      spaceBetween={0}
      centeredSlides={true}
      autoplay={{
        delay: 3500,
        disableOnInteraction: false,
      }}
      pagination={{ 
        clickable: true,
        dynamicBullets: true,
      }}
      navigation={true}
      loop={products.length > 1}
      modules={[Autoplay, Pagination, Navigation]}
      className="mySwiper"
    >
      {products.map((product) => (
        <SwiperSlide key={product.id} className="slide-container">
          {/* الصورة الرئيسية */}
          <img 
            src={product.image || product.image_url || 'https://via.placeholder.com/600x600?text=No+Image'} 
            className="main-img" 
            alt={product.name || 'Product'} 
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/600x600?text=No+Image';
            }}
          />
          
          {/* الخلفية المغبشة */}
          <img 
            src={product.image || product.image_url || 'https://via.placeholder.com/600x600?text=No+Image'} 
            className="bg-blur" 
            alt="background" 
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/600x600?text=No+Image';
            }}
          />
          
          {/* محتوى الشريحة */}
          <div className="slide-content">
            <Link   onClick={() => window.scrollTo(0, 0)} to="/shop" className="slide-btn">
            <span>🛒</span>
               تسوق الآن
                 </Link>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default AutoSwiper;