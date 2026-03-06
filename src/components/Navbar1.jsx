import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from "../assets/images/logo.jfif"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react';
import './style.css'
import { Link, useNavigate } from "react-router-dom";
import { useCategories } from '../context/CategoryContext';
const API_URL = import.meta.env.VITE_API_URL;
import axios from "axios";
import { faUnlock } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../context/CartContext';




function Navbar1() {
  const token = localStorage.getItem('access_token');
  const role = localStorage.getItem('role');
  const navigate = useNavigate()
  const { categories } = useCategories();
  const { cartCount } = useCart();



  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('role')
    navigate('/login')

  }




  return (
    <>

      <Navbar collapseOnSelect expand="lg" className="custom-navbar ps-1" sticky="top">
        <Navbar.Brand href="/">
          <div className="logo-container">
            <img src={logo} alt="logo" className="logo-img" />
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/" className="nav-link-custom">
              الرئيسية
            </Nav.Link>
            <Nav.Link href="/shop" className="nav-link-custom">
              المتجر
            </Nav.Link>
            <NavDropdown
              title="منتوجاتنا"
              id="collapsible-nav-dropdown"
              className="dropdown-custom"
            >
              {categories.map((cat) => (
                  <NavDropdown.Item  key={cat.id} href={`shop?category=${cat.id}`}>
                  {cat.name}
                  </NavDropdown.Item>
              ))}
              <NavDropdown.Item href="shop" >
                🔥 View All
              </NavDropdown.Item>
            </NavDropdown>
            {token && (
              <Nav.Link as={Link} to="/orders" className="nav-link-custom">
                الطلبات
              </Nav.Link>
            )}
            {token && role == "manager" && (
              <Nav.Link as={Link} to="/product/new" className="nav-link-custom">
                اضافة منتج
              </Nav.Link>
            )}

          </Nav>
          {
            token ? <Nav>
              <Nav.Link href="" onClick={logout} className="cart-icon-wrapper">
                <FontAwesomeIcon icon={faRightFromBracket} />
              </Nav.Link>
              <Nav.Link href="/cart" className="cart-icon-wrapper">
                <FontAwesomeIcon icon={faCartShopping} size="lg" />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Nav.Link>
            </Nav> :
              <Nav.Link href="/login" className="nav-link-custom ">
             <FontAwesomeIcon icon={faUnlock} /> دخول
              </Nav.Link>

          }

        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

export default Navbar1;