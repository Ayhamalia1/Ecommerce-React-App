import React, { useState ,useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Alert , Spinner ,Form} from 'react-bootstrap';
import { Trash2 } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL;
import Swal from 'sweetalert2';
import axios from 'axios'; // ✅ أضف هذا السطر
import './Cart.css';



function Cart() {
    const [cartItems,setCartItems]=useState(null)
    const [loading, setLoading] = useState(true);
    const [total,setTotal]=useState(null)
    const [addressData, setAddressData] = useState({
        fullName: "",
        phone: "",
        city: "",
        street: "",
        notes: ""
    });
    const [errors, setErrors] = useState({});




const CartProducts=async()=>{
     try{
        setLoading(true);
        const {data}=await axios.get(`${API_URL}/api/cart/`,
    {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      }
        )
        console.log(data)
        setCartItems(data.items)
        setTotal(data.total)
        }
        catch(e){
            console.error('خطأ:', e); // ✅ اطبع الخطأ
        }
        finally {
            setLoading(false);
        }
    }

const deleteCartItem=async(id)=>{
         try{
        const {data}=await axios.post(`${API_URL}/api/cart/remove/`,
           { product:id }
           ,
    {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      }
        )
           CartProducts();

        }
        catch(e){
            console.error('خطأ:', e); // ✅ اطبع الخطأ
        }
}
const updateQuantity=async(id ,newQty)=>{
         try{
        const {data}=await axios.post(`${API_URL}/api/cart/update_quantity/`,
           { product:id ,
            quantity:newQty
           }
           ,
    {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      }
        )
           CartProducts();
        }
        catch(e){
            console.error('خطأ:', e); // ✅ اطبع الخطأ
        }
}
const handleChange =(e)=>{
    const {name ,value} =e.target
    setAddressData({...addressData,[name]:value})
}

 const validateForm=()=>{
    const newErrors={}
    if(!addressData.fullName){
        newErrors.fullName='الاسم الكامل مطلوب'
    }
    if(!addressData.phone){
        newErrors.phone='رقم الموبايل مطلوب'
    }
    else if (!/^[0-9]{10}$/.test(addressData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'رقم الهاتف غير صحيح';
        }
         if (!addressData.city.trim()) {
            newErrors.city = 'المدينة مطلوبة';
        }
        
        if (!addressData.street.trim()) {
            newErrors.street = 'اسم الشارع مطلوب';
        }     
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
 }
const handleSubmit=(e)=>{
    e.preventDefault();
    if(validateForm())
    Swal.fire({
          icon: 'success',
                title: 'رائع!',
                text: 'تم حفظ العنوان بنجاح!✅',
                confirmButtonColor: '#1e3c72',
                timer: 2000
              });
}

const createOrder=async()=>{
         try{
        const {data}=await axios.post(`${API_URL}/api/orders/create_order/`,{address:addressData},
    {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      }
        )
              Swal.fire({
                icon: 'success',
                title: 'رائع!',
                text: 'تم انشاء طلبيتك بنجاح ✅',
                confirmButtonColor: '#1e3c72',
                timer: 2000
              });
        CartProducts();

        }
        catch(e){
                  Swal.fire({
                    icon: 'error',
                    title: 'خطأ',
                    text:`${e.response.data.error}`,
                    confirmButtonColor: '#1e3c72',
                  })
        }
}

 useEffect(() => {
   CartProducts();
}, []); 

    // ✅ أثناء التحميل
    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
                <p>جاري التحميل...</p>
            </Container>
        );
    }

    // ✅ إذا كانت السلة فارغة
    if (!cartItems|| cartItems.length === 0) {
        return (
            <Container className="mt-5">
                <Alert variant="info">السلة فارغة! 🛍️</Alert>
            </Container>
        );
    }

  return (
    <>
    <Container className="mt-5 mb-5">
      <h2 className="mb-4 text-center">🛒 سلة التسوق</h2>
      {/* إذا كانت السلة فارغة */}
      {/* <Alert variant="info">السلة فارغة! ابدأ بإضافة منتجات 🛍️</Alert> */}

      {/* محتوى السلة */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Table responsive hover>
            <thead className="bg-light">
              <tr>
                <th>المنتج</th>
                <th>السعر</th>
                <th>الكمية</th>
                <th>الإجمالي</th>
                <th>حذف</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={`${API_URL}${item.productImage}`}
                        alt={item.productName}
                        style={{ 
                          width: '60px', 
                          height: '60px', 
                          objectFit: 'cover', 
                          borderRadius: '8px',
                          border: '1px solid #dee2e6'
                        }}
                      />
                      <span className="fw-medium w-50">{item.productName}</span>
                    </div>
                  </td>
                  <td className="fw-bold align-middle">{item.price}₪</td>
                  <td className="align-middle">
                    <div className="d-flex align-items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        style={{ width: '32px', height: '32px' }}
                        onClick={()=>updateQuantity(item.product ,Math.max(1,item.quantity-1))}
                        disabled={item.quantity <=1}
                      >
                        −
                      </Button>
                      <span className="px-3 fw-medium">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        style={{ width: '32px', height: '32px' }}
                        onClick={()=>updateQuantity(item.product , item.quantity+1)}

                      >
                        +
                      </Button>
                    </div>
                  </td>
                  <td className="fw-bold  align-middle" 
                  style={{color:"#2a5298"}}>
                    {(item.price * item.quantity).toFixed(2)}₪
                  </td>
                  <td className="align-middle">
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={()=>{deleteCartItem(item.product)}}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
           <div className="order-address-container" dir="rtl">
            <Container>
                <div className="address-header">
                    <h1 className="address-title">
                        <span className="title-icon">📍</span>
                        عنوان التوصيل
                    </h1>
                    <p className="address-subtitle">
                        الرجاء إدخال عنوانك الكامل لإتمام الطلب
                    </p>
                </div>

                <div className="address-form-card">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            {/* Full Name */}
                            <Col md={6}>
                                <div className="form-group-custom">
                                    <label className="form-label-custom">
                                        <span className="label-icon">👤</span>
                                        الاسم الكامل
                                        <span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={addressData.fullName}
                                        onChange={handleChange}
                                        className={`form-input-custom `}
                                        placeholder="أدخل الاسم الكامل"
                                    />
                                </div>
                            </Col>

                            {/* Phone */}
                            <Col md={6}>
                                <div className="form-group-custom">
                                    <label className="form-label-custom">
                                        <span className="label-icon">📱</span>
                                        رقم الهاتف
                                        <span className="required">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={addressData.phone}
                                        onChange={handleChange}
                                        className={`form-input-custom ${errors.phone ? 'input-error' : ''}`}
                                        placeholder="05xxxxxxxx"
                                    />
                                    {errors.phone && (
                                        <span className="error-message">
                                            <span className="error-icon">⚠️</span>
                                            {errors.phone}
                                        </span>
                                    )}
                                </div>
                            </Col>

                            {/* City */}
                            <Col md={6}>
                                <div className="form-group-custom">
                                    <label className="form-label-custom">
                                        <span className="label-icon">🏙️</span>
                                        المدينة
                                        <span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={addressData.city}
                                        onChange={handleChange}
                                        className={`form-input-custom ${errors.city ? 'input-error' : ''}`}
                                        placeholder="اسم المدينة"
                                    />
                                    {errors.city && (
                                        <span className="error-message">
                                            <span className="error-icon">⚠️</span>
                                            {errors.city}
                                        </span>
                                    )}
                                </div>
                            </Col>

                            {/* Street */}
                            <Col md={6}>
                                <div className="form-group-custom">
                                    <label className="form-label-custom">
                                        <span className="label-icon">🛣️</span>
                                        الشارع
                                        <span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="street"
                                        value={addressData.street}
                                        onChange={handleChange}
                                        className={`form-input-custom ${errors.street ? 'input-error' : ''}`}
                                        placeholder="اسم الشارع"
                                    />
                                    {errors.street && (
                                        <span className="error-message">
                                            <span className="error-icon">⚠️</span>
                                            {errors.street}
                                        </span>
                                    )}
                                </div>
                            </Col>
                            {/* Notes */}
                            <Col md={12}>
                                <div className="form-group-custom">
                                    <label className="form-label-custom">
                                        <span className="label-icon">📝</span>
                                        ملاحظات إضافية
                                    </label>
                                    <textarea
                                        name="notes"
                                        value={addressData.notes}
                                        onChange={handleChange}
                                        className="form-textarea-custom"
                                        placeholder="أي ملاحظات تساعد في إيصال الطلب (اختياري)"
                                        rows="4"
                                    />
                                </div>
                            </Col>

                            {/* Submit Button */}
                            <Col md={12}>
                                <div className="form-actions">
                                    <button type="submit" className="submit-address-btn">
                                        <span className="btn-icon">✓</span>
                                        <span>تأكيد العنوان</span>
                                    </button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </div>

                {/* Address Preview Card */}
                {(addressData.fullName || addressData.phone || addressData.city) && (
                    <div className="address-preview-card">
                        <h3 className="preview-title">
                            <span className="preview-icon">👁️</span>
                            معاينة العنوان
                        </h3>
                        <div className="preview-content">
                            {addressData.fullName && (
                                <p className="preview-item">
                                    <span className="preview-label">الاسم:</span>
                                    <span className="preview-value">{addressData.fullName}</span>
                                </p>
                            )}
                            {addressData.phone && (
                                <p className="preview-item">
                                    <span className="preview-label">الهاتف:</span>
                                    <span className="preview-value">{addressData.phone}</span>
                                </p>
                            )}
                            {addressData.city && (
                                <p className="preview-item">
                                    <span className="preview-label">العنوان:</span>
                                    <span className="preview-value">
                                        {addressData.city}
                                        {addressData.street && `, ${addressData.street}`}
                                    </span>
                                </p>
                            )}
                            {addressData.notes && (
                                <p className="preview-item">
                                    <span className="preview-label">ملاحظات:</span>
                                    <span className="preview-value">{addressData.notes}</span>
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </Container>
        </div>

      {/* ملخص الطلب */}
      <Row >
        <Col className='' md={12}>
          <Card className="shadow-sm border-0" style={{ backgroundColor: '#f8f9fa' }}>
            <Card.Body className="p-4">
              <h4 className="mb-4 fw-bold text-center">ملخص الطلب</h4>
              
              <div className="d-flex justify-content-between mb-3 pb-3 border-bottom">
                <span className="text-muted">عدد المنتجات:</span>
                <span className="fw-bold">{cartItems.length}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-4">
                <span className="fs-5 fw-medium">المجموع الكلي:</span>
                <span className="fw-bold  fs-4" style={{color:"#2a5298"}}>{total}₪</span>
              </div>
              
              <Button
                size="lg"
                className="w-100 py-3 fw-bold"
                style={{ fontSize: '18px' ,background_color:'#ff6b6b'}}
                onClick={createOrder}
              >
                اشتر الآن 🛍️
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
 
    </>
  )
}

export default Cart