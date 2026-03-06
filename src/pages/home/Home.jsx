import React, { useState, useEffect } from 'react';
import Swiper from './AutoSwiper';
import './Home.css';
import { Link } from "react-router-dom";
import { useCategories } from '../../context/CategoryContext';
function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 15,
    minutes: 30,
    seconds: 45
  });
  const { categories } = useCategories();

  

  // Countdown Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const featuredProducts = [
    {
      id: 1,
      name: 'ساعة ذكية فاخرة',
      price: 299.99,
      oldPrice: 399.99,
      image: '⌚',
      rating: 4.8,
      isNew: true
    },
    {
      id: 2,
      name: 'سماعات لاسلكية',
      price: 149.99,
      oldPrice: 199.99,
      image: '🎧',
      rating: 4.9,
      isSale: true
    },
    {
      id: 3,
      name: 'كاميرا احترافية',
      price: 899.99,
      oldPrice: 1099.99,
      image: '📷',
      rating: 4.7,
      isNew: true
    },
    {
      id: 4,
      name: 'حقيبة جلدية أنيقة',
      price: 179.99,
      oldPrice: 229.99,
      image: '👜',
      rating: 4.6,
      isSale: true
    },
    {
      id: 5,
      name: 'نظارة شمسية عصرية',
      price: 89.99,
      oldPrice: 129.99,
      image: '🕶️',
      rating: 4.5,
      isNew: true
    },
    {
      id: 6,
      name: 'حذاء رياضي مريح',
      price: 129.99,
      oldPrice: 179.99,
      image: '👟',
      rating: 4.8,
      isSale: true
    }
  ];


  const reviews = [
    {
      id: 1,
      name: 'أحمد محمد',
      rating: 5,
      comment: 'منتجات رائعة وخدمة ممتازة! سرعة في التوصيل وجودة عالية.',
      avatar: '👨'
    },
    {
      id: 2,
      name: 'فاطمة علي',
      rating: 5,
      comment: 'تجربة تسوق مميزة، المنتجات كما هي في الصور تماماً.',
      avatar: '👩'
    },
    {
      id: 3,
      name: 'خالد سعيد',
      rating: 4,
      comment: 'أسعار منافسة وجودة ممتازة، أنصح بالشراء من هنا.',
      avatar: '👨‍💼'
    }
  ];

  const stats = [
    { number: '50K+', label: 'عميل سعيد', icon: '😊' },
    { number: '10K+', label: 'منتج متوفر', icon: '📦' },
    { number: '15+', label: 'سنة خبرة', icon: '⭐' },
    { number: '98%', label: 'معدل الرضا', icon: '❤️' }
  ];


  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert('شكراً لاشتراكك! سنرسل لك آخر العروض والأخبار.');
      setEmail('');
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-badge">🎉 عروض حصرية</span>
            <h1 className="hero-title">
              اكتشف عالم من
              <span className="gradient-text"> المنتجات المميزة</span>
            </h1>
            <p className="hero-description">
              تسوق من مجموعة واسعة من المنتجات عالية الجودة بأفضل الأسعار
            </p>
            <div className="btn-primary \">
              <Link   onClick={() => window.scrollTo(0, 0)} to="/shop" className="slide-btn">
            <span>🛒</span>
               تسوق الآن
                 </Link>
              <button className="btn-secondary">
                <span>🔍</span>
                اكتشف المزيد
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="floating-card card-1">💎</div>
            <div className="floating-card card-2">🎁</div>
            <div className="floating-card card-3">⭐</div>
          </div>
        </div>
      </section>

      {/* Swiper Section */}
      <section className="swiper-section">
        <Swiper />
      </section>

      {/* Special Offer Banner */}
      <section className="special-offer-section">
        <div className="offer-content">
          <div className="offer-text">
            <span className="offer-badge">🔥 عرض محدود</span>
            <h2 className="offer-title">خصم يصل إلى 50% على منتجات مختارة</h2>
            <p className="offer-description">لا تفوت هذه الفرصة الذهبية</p>
          </div>
          <div className="countdown-timer">
            <div className="timer-box">
              <span className="timer-number">{String(timeLeft.days).padStart(2, '0')}</span>
              <span className="timer-label">يوم</span>
            </div>
            <div className="timer-separator">:</div>
            <div className="timer-box">
              <span className="timer-number">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="timer-label">ساعة</span>
            </div>
            <div className="timer-separator">:</div>
            <div className="timer-box">
              <span className="timer-number">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="timer-label">دقيقة</span>
            </div>
            <div className="timer-separator">:</div>
            <div className="timer-box">
              <span className="timer-number">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="timer-label">ثانية</span>
            </div>
          </div>
        </div>
      </section>


      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-icon">🏷️</span>
            تسوق حسب الفئة
          </h2>
          <p className="section-subtitle">استكشف مجموعتنا الواسعة من المنتجات</p>
        </div>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className="category-card"
              >
              <h3 className="category-name">{category.name}</h3>
            <Link   onClick={() => window.scrollTo(0, 0)} to={`/shop?category=${category.id}`} className="slide-btn category-btn">
                تصفح الآن →   </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="statistics-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="reviews-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-icon">💬</span>
            آراء عملائنا
          </h2>
          <p className="section-subtitle">ماذا يقول عملاؤنا السعداء</p>
        </div>
        <div className="reviews-grid">
          {reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-avatar">{review.avatar}</div>
                <div className="reviewer-info">
                  <h4 className="reviewer-name">{review.name}</h4>
                  <div className="review-stars">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="star-filled">⭐</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="review-comment">"{review.comment}"</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;