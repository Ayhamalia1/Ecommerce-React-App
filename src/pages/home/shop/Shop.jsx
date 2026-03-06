import React, { useEffect, useState } from 'react';
import { Container } from "react-bootstrap";
import axios from "axios";
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShoppingCart, 
  faSearch, 
  faBoxOpen,
  faStar,
  faEdit,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
const API_URL = import.meta.env.VITE_API_URL;
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import OrderingDropdown from './OrderingDropdown';
import './Shop.css';
import { useCategories } from '../../../context/CategoryContext';
import ShopPagination from '../../pagination/ShopPagination'


function Shop() {
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const cat_id = searchParams.get("category");
  let [searchData, setSearchData] = useState("");
  let [orderData, setOrderData] = useState('');
  const [loading, setLoading] = useState(true);
  const { categories } = useCategories();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [count, setCount] = useState(0);


  
  // الحصول على دور المستخدم من localStorage
  const role = localStorage.getItem('role');
  const isManager = role === 'manager';

  const getProducts = async () => {
    setLoading(true);
  try {
    let params = {
      page: currentPage + 1,
    };

    if (cat_id) params.category = cat_id;
    if (searchData) params.search = searchData;
    if (orderData) params.ordering = orderData;

    const { data } = await axios.get(
      `${API_URL}/api/products/`,
      { params }
    );

    setProducts(data.results);
    setCount(data.count)
    console.log(data)
     console.log(currentPage)

  } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  function formHandle(e) {
    const { value } = e.target;
    setSearchData(value);
  }

  const getSearchProducts = async (e) => {
    e.preventDefault();
    try {
      let url = `${API_URL}/api/products/?search=${searchData}`;
      if (cat_id) {
        url += `&category=${cat_id}`;
      }
      let { data } = await axios.get(url);
      setProducts(data.results);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageClick=(e)=>{
    
    setCurrentPage(e.selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });

  }

  // دالة التعديل
  const handleEdit = (e, productId) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    navigate(`/products/edit/${productId}`);
  };

  // دالة الحذف مع 
  const handleDelete = async (e, productId, productName) => {
    e.preventDefault(); 
    
    // عرض تأكيد الحذف مع SweetAlert2
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: `سيتم حذف المنتج "${productName}" نهائياً!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'نعم، احذف!',
      cancelButtonText: 'إلغاء',
      reverseButtons: true
    });

    // إذا لم يتم التأكيد، توقف
    if (!result.isConfirmed) {
      return;
    }

    try {
      
      // عرض تنبيه "جاري الحذف..."
      Swal.fire({
        title: 'جاري الحذف...',
        text: 'يرجى الانتظار',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      await axios.delete(`${API_URL}/api/products/${productId}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });

      // تحديث قائمة المنتجات بعد الحذف
      setProducts(prevProducts => 
        prevProducts.filter(product => product.id !== productId)
      );

      // عرض رسالة نجاح
      Swal.fire({
        icon: 'success',
        title: 'تم الحذف!',
        text: 'تم حذف المنتج بنجاح',
        confirmButtonColor: '#4ade80',
        timer: 2000,
        timerProgressBar: true
      });


    } catch (error) {
      console.error('خطأ في حذف المنتج:', error);
      
      // عرض رسالة خطأ
      Swal.fire({
        icon: 'error',
        title: 'فشل الحذف!',
        text: error.response?.data?.message || 'حدث خطأ أثناء حذف المنتج. حاول مرة أخرى',
        confirmButtonColor: '#3085d6'
      });
    } 
  };

  useEffect(() => {
    getProducts();
  }, [cat_id, orderData,currentPage]);

  return (
    <div className="shop-container">
      <Container>
        {/* Header */}
        <div className="shop-header">
          <h1 className="shop-title">متجرنا</h1>
          <p className="shop-subtitle">اكتشف أفضل المنتجات بأفضل الأسعار</p>
        </div>

        {/* Tabs */}
        <div className="custom-tabs">
          <Tabs
            activeKey={cat_id ? cat_id : "all"}
            onSelect={(key) => {
              if (key === "all") {
                setSearchParams({});
              } else {
                setSearchParams({ category: key });
              }
            }}
          >
            <Tab eventKey="all" title="كل المنتجات"></Tab>
            {categories.map((cat) => (
              <Tab
                key={cat.id}
                eventKey={String(cat.id)}
                title={cat.name}
              ></Tab>
            ))}
          </Tabs>
        </div>

        {/* Search and Filter */}
        <div className="search-filter-section">
          <form className="search-form" onSubmit={getSearchProducts}>
            <input
              type="search"
              placeholder="ابحث عن المنتجات..."
              className="search-input"
              onChange={formHandle}
              value={searchData}
            />
            <button type="submit" className="search-btn">
              <FontAwesomeIcon icon={faSearch} style={{ marginLeft: '0.5rem' }} />
              بحث
            </button>
          </form>
          <div className="ordering-wrapper">
            <OrderingDropdown onChangeFunction={setOrderData} />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">جاري التحميل...</p>
          </div>
        ) : products.length === 0 ? (
          /* Empty State */
          <div className="empty-state">
            <FontAwesomeIcon icon={faBoxOpen} className="empty-icon" />
            <h3 className="empty-title">لا توجد منتجات</h3>
            <p className="empty-text">جرب البحث بكلمات أخرى أو تصفح فئة مختلفة</p>
          </div>
        ) : (
          /* Products Grid */
          <div className="products-grid">
            {products.map((item) => (
              <Link 
                key={item.id} 
                to={`/product/${item.id}`} 
                className="product-card-link"
              >
                <div className="product-card">
                  <div className="product-image-wrapper">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="product-image"
                      />
                    ) : (
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        height: '100%',
                        background: '#f0f0f0'
                      }}>
                        <FontAwesomeIcon icon={faBoxOpen} size="4x" color="#ccc" />
                      </div>
                    )}
                    <div className="product-badge">جديد</div>
                    
                    {/* Manager Actions - فقط للمدير */}
                    {isManager && (
                      <div className="manager-actions">
                        <button 
                          className="action-btn edit-btn"
                          onClick={(e) => handleEdit(e, item.id)}
                          title="تعديل المنتج"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button 
                          className="action-btn delete-btn"
                          onClick={(e) => handleDelete(e, item.id, item.name)}
                          title="حذف المنتج"
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    )}
                    
                    <div className="product-overlay">
                      <button className="quick-view-btn">
                        عرض سريع
                      </button>
                    </div>
                  </div>
                  
                  <div className="product-info">
                    <h3 className="product-name">{item.name}</h3>
                    
                    <div className="product-rating">
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} style={{ color: '#e0e0e0' }} />
                      <span style={{ color: '#6c757d', marginRight: '0.5rem' }}>
                        (4.0)
                      </span>
                    </div>

                    <div className="product-price-section">
                      <div className="product-price-main">
                        <span>{item.price}</span>
                        <span className="currency">₪</span>
                      </div>
                      <div className="add-to-cart-icon">
                        <FontAwesomeIcon icon={faShoppingCart} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
      {
       (count / 8) > 1 ?
             <ShopPagination handlePageClick={handlePageClick} PageCount={ Math.ceil(count / 8)}/>:
              null

      }

    </div>
  );
}

export default Shop;