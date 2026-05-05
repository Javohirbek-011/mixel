import React, { createContext, useEffect, useState, useCallback } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { getProduct, getCategories, getBrands, getCartItems, getLikedItems } from "./services";
import Card from "./components/Card";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import CategoryPage from "./pages/CategoryPage";

export const DataContext = createContext();

function App() {
  const [product, setProduct] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [brand, setBrand] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [cartItems, setCartItems] = useState([]);
  const [likedItems, setLikedItems] = useState([]);
  const [productLoading, setProductLoading] = useState(true);

  useEffect(() => {
    setProductLoading(true);
    getProduct().then((data) => {
      setProduct(data);
      setProductLoading(false);
    });
    getCategories().then((data) => setCategoryData(data));
    getBrands().then((data) => setBrand(data));
  }, []);

  const refreshCart = useCallback((tkn) => {
    const t = tkn || token;
    if (!t) { setCartItems([]); return; }
    getCartItems(t).then((data) => {
      const items = Array.isArray(data) ? data : data?.results || [];
      setCartItems(items);
    });
  }, [token]);

  const refreshLikes = useCallback((tkn) => {
    const t = tkn || token;
    if (!t) { setLikedItems([]); return; }
    getLikedItems(t).then((data) => {
      const items = Array.isArray(data) ? data : data?.results || [];
      setLikedItems(items);
    });
  }, [token]);

  useEffect(() => {
    if (token) {
      refreshCart(token);
      refreshLikes(token);
    } else {
      setCartItems([]);
      setLikedItems([]);
    }
  }, [token]);

  return (
    <BrowserRouter>
      <DataContext.Provider
        value={{
          setBrand, brand,
          product, setProduct, productLoading,
          categoryData, setCategoryData,
          token, setToken,
          cartItems, setCartItems, refreshCart,
          likedItems, setLikedItems, refreshLikes,
        }}
      >
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login setTokenTitle={setToken} />} />
          <Route path="/cards" element={<Card />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/categories/:id" element={<CategoryPage />} />
          <Route path="/brands/:id" element={<CategoryPage />} />
        </Routes>
        <Footer />
      </DataContext.Provider>
    </BrowserRouter>
  );
}

export default App;
