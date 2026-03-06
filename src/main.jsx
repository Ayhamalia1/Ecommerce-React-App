import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { CategoriesProvider } from './context/CategoryContext';
import { CartProvider } from './context/CartContext';




createRoot(document.getElementById('root')).render(
  <CartProvider>
  <CategoriesProvider>
  <StrictMode>
    <App />
  </StrictMode>
    </CategoriesProvider>
    </CartProvider>
,
)
