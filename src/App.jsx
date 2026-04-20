import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { getProduct, getCategories, getBrands } from "./services";
import Card from "./components/Card";
export const DataContext = createContext();
function App() {
  const [product, setProduct] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [brand, setBrand] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    getProduct().then((data) => {
      setProduct(data);
    });
    getCategories().then((data) => {
      setCategoryData(data);
    });
    getBrands().then((data) => {
      setBrand(data);
    });
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <DataContext.Provider
          value={{
            setBrand,
            brand,
            product,
            setProduct,
            categoryData,
            setCategoryData,
            token,
            setToken,
          }}
        >
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cards" element={<Card />} />
          </Routes>
          <Footer />
        </DataContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
