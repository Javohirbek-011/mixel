import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronRight, FiTrash2, FiMinus, FiPlus, FiTruck, FiShield } from "react-icons/fi";
import "../styles/cart.css";

const MOCK_ITEMS = [
  { id: 18, name: "S20 Ultra 12/256 GB", price: 3000000, qty: 1, image: "https://abzzvx.pythonanywhere.com/media/images/s20u_bdBLWF6.jpg" },
  { id: 19, name: "Blender", price: 250000, qty: 1, image: "https://abzzvx.pythonanywhere.com/media/images/blender.jpg" },
  { id: 20, name: "Simsiz quloqchinlar", price: 49000, qty: 1, image: "https://abzzvx.pythonanywhere.com/media/images/pods.jpg" },
];

const REGIONS = ["Toshkent viloyati", "Andijon", "Farg'ona", "Namangan", "Samarqand", "Buxoro", "Xorazm", "Surxondaryo", "Qashqadaryo", "Navoiy", "Jizzax", "Sirdaryo", "Qoraqalpog'iston"];

export default function Cart() {
  const [items, setItems] = useState(MOCK_ITEMS);
  const [payment, setPayment] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [floor, setFloor] = useState("");
  const [date, setDate] = useState("");

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const formatPrice = (p) => Number(p).toLocaleString("ru-RU");

  return (
    <main className="cart-page">
      <div className="cart-container">

        <nav className="cart-breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight />
          <span>Make a purchase</span>
        </nav>

        <h1 className="cart-title">Make a purchase</h1>

        <div className="cart-layout">
          {/* LEFT COLUMN */}
          <div className="cart-left">

            {/* STEP 1 */}
            <div className="cart-step">
              <div className="cart-step-header">
                <div className="step-badge">1</div>
                <h2>Your order</h2>
                <button className="cart-change-btn">Change</button>
              </div>

              <div className="cart-items">
                {items.length === 0 ? (
                  <div className="cart-empty">
                    <p>Your cart is empty</p>
                    <Link to="/" className="cart-empty-link">Continue shopping →</Link>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-img">
                        <img src={item.image} alt={item.name}
                          onError={(e) => { e.target.src = "/telephone.png"; }} />
                      </div>
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-controls">
                        <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>
                          <FiMinus />
                        </button>
                        <span className="qty-num">{item.qty}</span>
                        <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>
                          <FiPlus />
                        </button>
                      </div>
                      <div className="cart-item-price">
                        {formatPrice(item.price * item.qty)} сум
                      </div>
                      <button className="cart-item-delete" onClick={() => removeItem(item.id)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="cart-divider" />

            {/* STEP 2 */}
            <div className="cart-step">
              <div className="cart-step-header">
                <div className="step-badge">2</div>
                <h2>Your details</h2>
              </div>
              <div className="cart-form">
                <div className="form-row">
                  <input
                    className="form-input full"
                    type="tel"
                    placeholder="Phone number *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="form-row two-col">
                  <input
                    className="form-input"
                    type="text"
                    placeholder="First name **"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Last name **"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="cart-divider" />

            {/* STEP 3 */}
            <div className="cart-step">
              <div className="cart-step-header">
                <div className="step-badge">3</div>
                <h2>Select a payment method</h2>
              </div>
              <div className="payment-grid">
                {["Payment via Payme", "Online (UZCARD/HUMO)", "Cash on delivery", "Installment plan"].map((method) => (
                  <label key={method} className={`payment-option ${payment === method ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={payment === method}
                      onChange={() => setPayment(method)}
                    />
                    <span className="radio-dot" />
                    <span>{method}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="cart-divider" />

            {/* STEP 4 */}
            <div className="cart-step">
              <div className="cart-step-header">
                <div className="step-badge">4</div>
                <h2>Method of obtaining</h2>
              </div>

              <div className="city-label">YOUR CITY</div>
              <div className="city-options">
                <button className="city-btn active">
                  <span className="city-dot" />
                  Tashkent
                </button>
              </div>

              <div className="cart-form" style={{ marginTop: 16 }}>
                <div className="form-row two-col">
                  <div className="select-wrap">
                    <select
                      className="form-select"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                    >
                      <option value="">Region / Oblast *</option>
                      {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="select-wrap">
                    <select
                      className="form-select"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                    >
                      <option value="">District / City *</option>
                      <option>Yunusobod</option>
                      <option>Chilonzor</option>
                      <option>Mirzo Ulug'bek</option>
                      <option>Shayxontohur</option>
                    </select>
                  </div>
                </div>

                <div className="form-row two-col">
                  <input
                    className="form-input"
                    style={{ flex: 2 }}
                    type="text"
                    placeholder="Detailed Address (Street, House) *"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Floor"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <div className="date-wrap">
                    <label className="date-label">Preferred delivery date</label>
                    <input
                      className="form-input full"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: ORDER SUMMARY (sticky) */}
          <div className="cart-right">
            <div className="order-summary">
              <h3 className="summary-title">Order Summary</h3>

              <div className="summary-rows">
                <div className="summary-row">
                  <span>Items ({items.reduce((s, i) => s + i.qty, 0)})</span>
                  <span>{formatPrice(total)} сум</span>
                </div>
                <div className="summary-row">
                  <span>Delivery</span>
                  <span className="summary-free">FREE</span>
                </div>
              </div>

              <div className="summary-divider" />

              <div className="summary-total-row">
                <span>Total amount:</span>
                <span className="summary-total">{formatPrice(total)} сум</span>
              </div>

              <button className="checkout-btn">
                Checkout now
              </button>

              <p className="summary-agreement">
                By clicking "Checkout now", I agree to the{" "}
                <a href="#">User Agreement</a> and Privacy Policy.
              </p>

              <div className="summary-perks">
                <div className="summary-perk">
                  <FiTruck />
                  <span>Free delivery</span>
                </div>
                <div className="summary-perk">
                  <FiShield />
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}