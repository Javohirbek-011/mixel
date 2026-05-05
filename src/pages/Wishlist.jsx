import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiTrash2, FiChevronRight } from "react-icons/fi";
import { DataContext } from "../App";
import { removeLike, addToCart } from "../services";
import "../styles/wishlist.css";

export default function Wishlist() {
  const navigate = useNavigate();
  const { token, likedItems, refreshLikes, cartItems, refreshCart } = useContext(DataContext);

  if (!token) {
    return (
      <main className="wishlist-page">
        <div className="wishlist-container">
          <div className="wishlist-empty-state">
            <FiHeart className="wishlist-empty-icon" />
            <h2>Sevimlilar bo'sh</h2>
            <p>Ko'rish uchun avval tizimga kiring</p>
            <Link to="/login" className="wishlist-login-btn">Kirish</Link>
          </div>
        </div>
      </main>
    );
  }

  const handleRemove = async (likeId) => {
    await removeLike(token, likeId);
    await refreshLikes(token);
  };

  const handleAddToCart = async (productId) => {
    const already = cartItems.find((c) => c.product === productId);
    if (!already) {
      await addToCart(token, productId, 1);
      await refreshCart(token);
    } else {
      navigate("/cart");
    }
  };

  const formatPrice = (p) => {
    if (!p && p !== 0) return "";
    return Number(p).toLocaleString("ru-RU") + " so'm";
  };

  return (
    <main className="wishlist-page">
      <div className="wishlist-container">
        <nav className="wishlist-breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight />
          <span>Sevimlilar</span>
        </nav>

        <div className="wishlist-header">
          <h1 className="wishlist-title">
            Sevimlilar <span className="wishlist-count">({likedItems.length})</span>
          </h1>
          {likedItems.length > 0 && (
            <Link to="/" className="wishlist-continue">Xarid davom ettirish →</Link>
          )}
        </div>

        {likedItems.length === 0 ? (
          <div className="wishlist-empty-state">
            <FiHeart className="wishlist-empty-icon" />
            <h2>Sevimlilar ro'yxati bo'sh</h2>
            <p>Mahsulotlarni sevimlilar ro'yxatiga qo'shing</p>
            <Link to="/" className="wishlist-login-btn">Mahsulotlarni ko'rish →</Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {likedItems.map((item) => (
              <div key={item.id} className="wishlist-card">
                <button
                  className="wishlist-remove-btn"
                  onClick={() => handleRemove(item.id)}
                  title="O'chirish"
                >
                  <FiTrash2 />
                </button>

                <Link to={`/product/${item.product}`} className="wishlist-card-img-wrap">
                  <img
                    src={item.main_image || item.product_image}
                    alt={item.product_name}
                    className="wishlist-card-img"
                    onError={(e) => { e.target.src = "/telephone.png"; }}
                  />
                </Link>

                <div className="wishlist-card-body">
                  <Link to={`/product/${item.product}`} className="wishlist-card-name">
                    {item.product_name}
                  </Link>
                  <div className="wishlist-card-price">
                    {formatPrice(item.product_price)}
                  </div>
                  <button
                    className="wishlist-cart-btn"
                    onClick={() => handleAddToCart(item.product)}
                  >
                    <FiShoppingCart />
                    {cartItems.find((c) => c.product === item.product)
                      ? "Savatchada →"
                      : "Savatchaga qo'shish"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
