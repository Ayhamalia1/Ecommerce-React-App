import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFacebook, 
  faTwitter, 
  faInstagram, 
  faLinkedin 
} from '@fortawesome/free-brands-svg-icons';
import { 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt,
  faHeart 
} from '@fortawesome/free-solid-svg-icons';
import logo from "../assets/images/logo.jfif";
import './style.css';
function Footer() {
const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // هنا يمكنك إضافة منطق إرسال البريد الإلكتروني
    alert('شكراً لاشتراكك في النشرة البريدية!');
  };

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-grid">
          {/* قسم الشعار والوصف */}
          <div className="footer-section footer-logo-section">
            <div className="footer-logo">
              <img src={logo} alt="Logo" />
            </div>
            <p className="footer-description">
              نحن نقدم أفضل المنتجات والخدمات لعملائنا. جودة عالية وأسعار منافسة مع خدمة عملاء متميزة.
            </p>
            <div className="social-links">
              <a href="#facebook" className="social-icon" aria-label="Facebook">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="#twitter" className="social-icon" aria-label="Twitter">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="#instagram" className="social-icon" aria-label="Instagram">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="#linkedin" className="social-icon" aria-label="LinkedIn">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
            </div>
          </div>

          {/* روابط سريعة */}
          <div className="footer-section">
            <h3 className="footer-title">روابط سريعة</h3>
            <ul className="footer-links">
              <li>
                <a href="/" className="footer-link">الرئيسية</a>
              </li>
              <li>
                <a href="/shop" className="footer-link">المتجر</a>
              </li>
              <li>
                <a href="/about" className="footer-link">من نحن</a>
              </li>
              <li>
                <a href="/contact" className="footer-link">اتصل بنا</a>
              </li>
              <li>
                <a href="/blog" className="footer-link">المدونة</a>
              </li>
            </ul>
          </div>

          {/* خدمة العملاء */}
          <div className="footer-section">
            <h3 className="footer-title">خدمة العملاء</h3>
            <ul className="footer-links">
              <li>
                <a href="/faq" className="footer-link">الأسئلة الشائعة</a>
              </li>
              <li>
                <a href="/shipping" className="footer-link">الشحن والتوصيل</a>
              </li>
              <li>
                <a href="/returns" className="footer-link">سياسة الإرجاع</a>
              </li>
              <li>
                <a href="/terms" className="footer-link">الشروط والأحكام</a>
              </li>
              <li>
                <a href="/privacy" className="footer-link">سياسة الخصوصية</a>
              </li>
            </ul>
          </div>

          {/* معلومات الاتصال والنشرة البريدية */}
          <div className="footer-section">
            <h3 className="footer-title">تواصل معنا</h3>
            <div className="footer-contact-info">
              <div className="contact-item">
                <div className="contact-icon">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </div>
                <span>رام الله، فلسطين</span>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <FontAwesomeIcon icon={faPhone} />
                </div>
                <span dir="ltr">+970 123 456 789</span>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <span>info@example.com</span>
              </div>
            </div>

            <div className="newsletter-section">
              <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                اشترك في النشرة البريدية
              </h4>
              <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
                <input
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-button">
                  اشترك
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <span>© {currentYear} جميع الحقوق محفوظة</span>
            <span>•</span>
            <span>صنع بـ</span>
            <FontAwesomeIcon icon={faHeart} className="heart-icon" />
          </div>
          <div className="footer-bottom-links">
            <a href="/privacy" className="footer-bottom-link">
              الخصوصية
            </a>
            <a href="/terms" className="footer-bottom-link">
              الشروط
            </a>
            <a href="/sitemap" className="footer-bottom-link">
              خريطة الموقع
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer