import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from './components/Root';
import Home from './pages/home/Home';
import Register from './auth/register/Register';
import Login from './auth/login/Login';
import Shop from './pages/home/shop/Shop';
import ProductDetails from './pages/product/ProductDetails';
import Cart from './pages/cart/Cart';
import Orders from './pages/orders/Orders';
import NewProduct from './pages/product/NewProduct';
import ProtectedLayout from './components/ProtectedLayout';


function App() {
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "shop", element: <Shop /> },
      { path: "product/:id", element: <ProductDetails /> },
      {
        element: <ProtectedLayout />,
        children: [
          { path: "cart", element: <Cart /> },
          { path: "orders", element: <Orders /> },
          { path: "product/new", element: <NewProduct /> },
        ],
      },
    ],
  },
]);

  return (
    <>
        <RouterProvider router={router} />
    </>
  )
}

export default App
