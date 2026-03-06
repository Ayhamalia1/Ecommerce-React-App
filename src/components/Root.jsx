import React from 'react'
import { Outlet } from "react-router-dom";
import Navbar1 from "./Navbar1.jsx";
import Container from 'react-bootstrap/Container';
import Footer from './Footer.jsx';

function Root() {
  const token =localStorage.getItem('access_token')
  return (
    <>
      <Navbar1 />       
        <Outlet />
        <Footer />
    </>
  )
}

export default Root;
