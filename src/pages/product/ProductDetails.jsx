import React from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShoppingCart, 
  faTruck, 
  faShieldAlt, 
  faUndo, 
  faStar 
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import './ProductDetails.css';

const API_URL = import.meta.env.VITE_API_URL;
import { useCart } from '../../context/CartContext';


function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { fetchCartCount } = useCart();


  const getProduct = async () => {
    try {
      let { data } = await axios.get(`${API_URL}/api/products/${id}/`);
      setProduct(data);
    } catch (e) {
      console.error("خطأ في جلب المنتج:", e);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/cart/add/`,
        {
          product: product.id,
          quantity: quantity
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      Swal.fire({
        icon: 'success',
        title: 'رائع!',
        text: 'تم إضافة المنتج للسلة بنجاح ✅',
        confirmButtonColor: '#1e3c72',
        timer: 2000
      });
       await fetchCartCount();
    } catch (e) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يرجى تسجيل الدخول للمتابعة',
        showCancelButton: true,
        confirmButtonText: 'تسجيل الدخول',
        cancelButtonText: 'إلغاء',
        confirmButtonColor: '#1e3c72',
        cancelButtonColor: '#6c757d',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  if (loading) {
    return (
      <div className="product-details-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-container">
        <div className="not-found">لم يتم العثور على المنتج</div>
      </div>
    );
  }

  return (
    <div className="product-details-container">
      <Container>
        <div className="product-card">
          <Row className="g-0">
            {/* قسم الصورة */}
            <Col lg={6} className="product-image-section">
              {product.stock > 0 ? (
                <div className="product-badge">متوفر</div>
              ) : (
                <div className="product-badge" style={{ background: '#c62828' }}>
                  غير متوفر
                </div>
              )}
              {product.image? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-main-image"
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <FontAwesomeIcon icon={faShoppingCart} size="6x" color="#e0e0e0" />
                  <p style={{ marginTop: '1rem', color: '#6c757d' }}>لا توجد صورة</p>
                </div>
              )}
            </Col>

            {/* قسم المعلومات */}
            <Col lg={6} className="product-info-section">
              <h1 className="product-title">{product.name}</h1>

              <div className="stock-info" style={{
                background: product.stock > 0 ? '#e8f5e9' : '#ffebee',
                color: product.stock > 0 ? '#2e7d32' : '#c62828'
              }}>
                {product.stock > 0 
                  ? `متوفر في المخزون (${product.stock} قطعة)`
                  : 'غير متوفر حالياً'
                }
              </div>

              <p className="product-description">
                {product.descreption || 'لا يوجد وصف متاح لهذا المنتج.'}
              </p>

              <div className="price-section">
                <div className="price-label">السعر</div>
                <h3 className="product-price">
                  <span>{product.price}</span>
                  <span className="currency">₪</span>
                </h3>
              </div>

              <div className="quantity-section">
                <div className="section-label">الكمية</div>
                <div className="quantity-controls">
                  <div className="quantity-input-group">
                    <button 
                      className="quantity-btn"
                      onClick={() => setQuantity(qty => Math.max(1, qty - 1))}
                      disabled={product.stock === 0}
                    >
                      −
                    </button>
                    <input
                      type="text"
                      value={quantity}
                      readOnly
                      className="quantity-display"
                    />
                    <button 
                      className="quantity-btn"
                      onClick={() => setQuantity(qty => Math.min(product.stock, qty + 1))}
                      disabled={product.stock === 0}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <button
                className="add-to-cart-btn"
                onClick={addToCart}
                disabled={product.stock === 0}
              >
                <FontAwesomeIcon icon={faShoppingCart} />
                <span>{product.stock > 0 ? 'إضافة إلى السلة' : 'غير متوفر'}</span>
              </button>

              {/* المميزات */}
              <div className="product-features">
                <h4 className="section-label">المميزات</h4>
                <div className="features-grid">
                  <div className="feature-item">
                    <div className="feature-icon">
                      <FontAwesomeIcon icon={faTruck} />
                    </div>
                    <span className="feature-text">شحن مجاني</span>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">
                      <FontAwesomeIcon icon={faShieldAlt} />
                    </div>
                    <span className="feature-text">ضمان الجودة</span>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">
                      <FontAwesomeIcon icon={faUndo} />
                    </div>
                    <span className="feature-text">إرجاع مجاني</span>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">
                      <FontAwesomeIcon icon={faStar} />
                    </div>
                    <span className="feature-text">منتج مميز</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default ProductDetails;