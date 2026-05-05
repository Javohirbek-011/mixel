import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiChevronRight, FiTrash2, FiMinus, FiPlus,
  FiTruck, FiShield, FiShoppingCart, FiPhone, FiUser,
} from "react-icons/fi";
import { DataContext } from "../App";
import { updateCartItem, removeCartItem, createOrder } from "../services";
import "../styles/cart.css";

const PAYMENT_TYPES = [
  {
    id: "payme",
    label: "Payme",
    desc: "Online to'lov",
    color: "#00AAFF",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width="32" height="32">
        <rect width="40" height="40" rx="8" fill="#00AAFF"/>
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">PAY</text>
      </svg>
    ),
  },
  {
    id: "uzcard",
    label: "UZCARD / HUMO",
    desc: "Bank kartasi",
    color: "#1A56DB",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width="32" height="32">
        <rect width="40" height="40" rx="8" fill="#1A56DB"/>
        <rect x="6" y="13" width="28" height="14" rx="2" fill="white" fillOpacity="0.2"/>
        <rect x="6" y="19" width="28" height="3" fill="white" fillOpacity="0.5"/>
        <rect x="6" y="24" width="10" height="2" rx="1" fill="white"/>
      </svg>
    ),
  },
  {
    id: "cash",
    label: "Naqd pul",
    desc: "Yetkazganda",
    color: "#16A34A",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width="32" height="32">
        <rect width="40" height="40" rx="8" fill="#16A34A"/>
        <rect x="7" y="13" width="26" height="14" rx="2" fill="white" fillOpacity="0.25"/>
        <circle cx="20" cy="20" r="5" fill="white" fillOpacity="0.6"/>
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">$</text>
      </svg>
    ),
  },
  {
    id: "installment",
    label: "Bo'lib to'lash",
    desc: "0% foiz",
    color: "#7C3AED",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width="32" height="32">
        <rect width="40" height="40" rx="8" fill="#7C3AED"/>
        <text x="50%" y="52%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">%</text>
      </svg>
    ),
  },
];

export default function Cart() {
  const { token, cartItems, refreshCart } = useContext(DataContext);

  const [payment, setPayment] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (token) refreshCart(token);
  }, [token]);

  if (!token) {
    return (
      <main className="cart-page">
        <div className="cart-container">
          <div className="cart-empty-state">
            <FiShoppingCart className="cart-empty-icon" />
            <h2>Savatcha bo'sh</h2>
            <p>Xarid qilish uchun avval tizimga kiring</p>
            <Link to="/login" className="cart-login-btn">Kirish</Link>
          </div>
        </div>
      </main>
    );
  }

  const handleQty = async (item, delta) => {
    const newAmt = Math.max(1, item.amount + delta);
    if (newAmt === item.amount) return;
    setUpdatingId(item.id);
    await updateCartItem(token, item.id, newAmt);
    await refreshCart(token);
    setUpdatingId(null);
  };

  const handleRemove = async (itemId) => {
    setUpdatingId(itemId);
    await removeCartItem(token, itemId);
    await refreshCart(token);
    setUpdatingId(null);
  };

  const total = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.total_price || item.product_price || 0), 0
  );
  const totalQty = cartItems.reduce((s, i) => s + (i.amount || 1), 0);
  const fmt = (p) => Number(p).toLocaleString("ru-RU");

  const handleCheckout = async (e) => {
    e.preventDefault();
    setCheckoutError("");
    if (!firstName || !lastName || !phone) {
      setCheckoutError("Ism, familiya va telefon raqamni kiriting.");
      return;
    }
    if (!payment) {
      setCheckoutError("To'lov usulini tanlang.");
      return;
    }
    if (cartItems.length === 0) {
      setCheckoutError("Savatcha bo'sh.");
      return;
    }
    setCheckoutLoading(true);
    const cartItemIds = cartItems.map((i) => i.id);
    const result = await createOrder(token, cartItemIds);
    setCheckoutLoading(false);

    if (result?.order_id || result?.id) {
      setCheckoutSuccess(true);
      await refreshCart(token);
    } else {
      const errMsg = result
        ? Object.values(result).flat().join(" ")
        : "Xatolik yuz berdi.";
      setCheckoutError(errMsg || "Xatolik yuz berdi.");
    }
  };

  if (checkoutSuccess) {
    return (
      <main className="cart-page">
        <div className="cart-container">
          <div className="checkout-success">
            <div className="success-checkmark">
              <svg viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="25" fill="none" />
                <path fill="none" d="M14 27l8 8 16-16" />
              </svg>
            </div>
            <h2>Buyurtma qabul qilindi!</h2>
            <p>Tez orada siz bilan bog'lanamiz.</p>
            <Link to="/" className="success-home-btn">Bosh sahifaga qaytish →</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-container">
        <nav className="cart-breadcrumb">
          <Link to="/">Bosh sahifa</Link>
          <FiChevronRight />
          <span>Savatcha</span>
        </nav>

        {cartItems.length === 0 ? (
          <div className="cart-empty-state">
            <FiShoppingCart className="cart-empty-icon" />
            <h2>Savatcha bo'sh</h2>
            <p>Mahsulotlarni savatchaga qo'shing</p>
            <Link to="/" className="cart-login-btn">Xarid qilish →</Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* ── LEFT ── */}
            <div className="cart-left">

              {/* Items */}
              <div className="cart-card">
                <div className="cart-card-title">
                  <FiShoppingCart />
                  <span>Savatcha</span>
                  <span className="cart-card-badge">{totalQty}</span>
                </div>
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className={`cart-item ${updatingId === item.id ? "cart-item-updating" : ""}`}
                    >
                      <div className="cart-item-img">
                        <img
                          src={item.main_image}
                          alt={item.product_name}
                          onError={(e) => { e.target.src = "/telephone.png"; }}
                        />
                      </div>
                      <div className="cart-item-info">
                        <p className="cart-item-name">{item.product_name}</p>
                        <p className="cart-item-unit">{fmt(item.product_price)} so'm / dona</p>
                      </div>
                      <div className="cart-item-controls">
                        <button type="button" className="qty-btn"
                          onClick={() => handleQty(item, -1)}
                          disabled={updatingId === item.id}>
                          <FiMinus />
                        </button>
                        <span className="qty-num">{item.amount}</span>
                        <button type="button" className="qty-btn"
                          onClick={() => handleQty(item, 1)}
                          disabled={updatingId === item.id}>
                          <FiPlus />
                        </button>
                      </div>
                      <div className="cart-item-price">
                        {fmt(item.total_price || item.product_price)} so'm
                      </div>
                      <button type="button" className="cart-item-delete"
                        onClick={() => handleRemove(item.id)}
                        disabled={updatingId === item.id}>
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="cart-card">
                <div className="cart-card-title">
                  <FiUser />
                  <span>Kontakt ma'lumotlar</span>
                </div>
                <div className="contact-grid">
                  <div className="input-group">
                    <label>Ism *</label>
                    <input
                      type="text"
                      placeholder="Ismingiz"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label>Familiya *</label>
                    <input
                      type="text"
                      placeholder="Familiyangiz"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  <div className="input-group full-width">
                    <label>Telefon raqam *</label>
                    <div className="phone-input-wrap">
                      <span className="phone-prefix"><FiPhone /> +998</span>
                      <input
                        type="tel"
                        placeholder="90 123 45 67"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="cart-card">
                <div className="cart-card-title">
                  <span className="cart-card-title-icon">💳</span>
                  <span>To'lov usulini tanlang</span>
                </div>
                <div className="payment-grid">
                  {PAYMENT_TYPES.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      className={`payment-tile ${payment === m.id ? "selected" : ""}`}
                      onClick={() => setPayment(m.id)}
                      style={{ "--accent": m.color }}
                    >
                      <div className="payment-tile-top">
                        <div className="payment-tile-icon">{m.icon}</div>
                        {payment === m.id && (
                          <span className="payment-tile-check">✓</span>
                        )}
                      </div>
                      <span className="payment-tile-label">{m.label}</span>
                      <span className="payment-tile-desc">{m.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* ── RIGHT: SUMMARY ── */}
            <div className="cart-right">
              <form className="order-summary" onSubmit={handleCheckout}>
                <h3 className="summary-title">Buyurtma</h3>

                <div className="summary-items">
                  {cartItems.map((item) => (
                    <div key={item.id} className="summary-item-row">
                      <img
                        src={item.main_image}
                        alt={item.product_name}
                        className="summary-item-img"
                        onError={(e) => { e.target.src = "/telephone.png"; }}
                      />
                      <span className="summary-item-name">{item.product_name}</span>
                      <span className="summary-item-qty">×{item.amount}</span>
                      <span className="summary-item-price">
                        {fmt(item.total_price || item.product_price)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="summary-divider" />

                <div className="summary-rows">
                  <div className="summary-row">
                    <span>Mahsulotlar ({totalQty})</span>
                    <span>{fmt(total)} so'm</span>
                  </div>
                  <div className="summary-row">
                    <span>Yetkazib berish</span>
                    <span className="summary-free">BEPUL</span>
                  </div>
                </div>

                <div className="summary-divider" />

                <div className="summary-total-row">
                  <span>Jami</span>
                  <span className="summary-total">{fmt(total)} so'm</span>
                </div>

                {/* Selected payment badge */}
                {payment && (
                  <div className="selected-payment-badge">
                    {PAYMENT_TYPES.find((p) => p.id === payment)?.label} tanlandi ✓
                  </div>
                )}

                {checkoutError && (
                  <p className="checkout-error">{checkoutError}</p>
                )}

                <button
                  type="submit"
                  className="checkout-btn"
                  disabled={checkoutLoading || !payment}
                >
                  {checkoutLoading ? (
                    <span className="checkout-spinner" />
                  ) : (
                    "Buyurtma berish"
                  )}
                </button>

                <div className="summary-perks">
                  <div className="summary-perk"><FiTruck /><span>Bepul yetkazib berish</span></div>
                  <div className="summary-perk"><FiShield /><span>Xavfsiz to'lov</span></div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
