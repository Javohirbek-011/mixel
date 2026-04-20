import React, { useState, useContext } from "react";
import { IoLocationSharp } from "react-icons/io5";
import {
  FiShoppingCart,
  FiHeart,
  FiBell,
  FiUser,
  FiSearch,
  FiMenu,
  FiSmartphone,
  FiWifi,
  FiCamera,
  FiCpu,
  FiLogOut,
} from "react-icons/fi";
import { IoIosLaptop } from "react-icons/io";
import { MdCategory, MdOutlineNavigateNext } from "react-icons/md";
import "../styles/navbar.css";
import { Link } from "react-router-dom";
import { DataContext } from "../App";

function Navbar() {
  const [categoryModal, setCategoryModal] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const { token, setToken } = useContext(DataContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserModal(false);
  };

  return (
    <>
      <div className="navbar-top">
        <div className="container">
          <div className="navbar-top-content">
            <div className="navbar-top-left">
              <IoLocationSharp className="icon" />
              <span>Tashkent</span>
            </div>

            <div className="navbar-top-center">
              <span>Our Stores</span>
              <span>B2B Trading</span>
              <span>Purchase on Installment</span>
              <span>Payment Methods</span>
              <span>Warranty on Products</span>
            </div>

            <div className="navbar-top-right">
              <a href="tel:+998951235588" className="phone-link">
                <FiSmartphone className="icon" />
                <span>+998 95 123 55 88</span>
              </a>
              <select className="language-select">
                <option>Eng</option>
                <option>Rus</option>
                <option>Uz</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <nav className="navbar">
        <div className="container">
          <div className="navbar-main">
            <div className="navbar-brand">
              <Link to="/">
                <img src="/navbarlogo.png" alt="" />
              </Link>
            </div>

            <div className="navbar-search">
              <input
                type="text"
                placeholder="All categories - Phones and tablets"
              />
              <button>
                <FiSearch className="icon" />
                Search
              </button>
            </div>

            <div className="navbar-actions">
              {!token ? (
                <Link to="/signup" className="action-btn">
                  <FiUser className="icon" />
                  <span>Sign Up</span>
                </Link>
              ) : (
                <div className="account-dropdown">
                  <button
                    className="action-btn"
                    onClick={() => {
                      setUserModal(!userModal);
                      setCategoryModal(false);
                    }}
                  >
                    <FiUser className="icon" />
                    <span>User</span>
                  </button>

                  {userModal && (
                    <div className="account-modal">
                      <Link to="/account" className="modal-item">
                        <FiUser className="modal-icon" />
                        <span>Profile</span>
                      </Link>
                      <button
                        className="modal-item logout-btn"
                        onClick={handleLogout}
                      >
                        <FiLogOut className="modal-icon" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button className="action-btn">
                <FiBell className="icon" />
                <span>Notifications</span>
              </button>
              <button className="action-btn">
                <FiHeart className="icon" />
                <span>Favorites</span>
              </button>
              <button className="action-btn cart">
                <FiShoppingCart className="icon" />
                <span>Cart</span>
                <span className="badge">0</span>
              </button>
            </div>
          </div>

          <div className="navbar-menu">
            <button
              type="button"
              className="menu-btn"
              onClick={() => {
                setCategoryModal(!categoryModal);
                setUserModal(false);
              }}
            >
              <FiMenu className="icon" />
              <MdCategory className="icon" />
              <span>Categories</span>
            </button>

            <div className="navbar-links">
              <a href="#">Our Stores</a>
              <a href="#">Mono Brands</a>
              <a href="#">Phones & Tablets</a>
              <a href="#">Laptops</a>
              <a href="#">Accessories</a>
              <a href="#">Network Equipment</a>
              <a href="#">Office Equipment</a>
            </div>
          </div>

          <div
  className={`category-modal ${categoryModal ? "open" : ""}`}
  onClick={() => setCategoryModal(false)}
>
  <div className="category-modal-backdrop" />

  <div
    className="category-modal-panel"
    onClick={(e) => e.stopPropagation()}
  >
    <div className="category-modal-grid">
      <button
        type="button"
        className="modal-close"
        onClick={() => setCategoryModal(false)}
      >
        ×
      </button>

      <div className="category-modal-list">
        <div className="category-modal-title">Categories</div>

        <a href="#">
          <FiSmartphone className="list-icon" />
          Phones & Tablets
          <MdOutlineNavigateNext className="navigate-icon" />
        </a>

        <a href="#">
          <IoIosLaptop className="list-icon" />
          Laptops
          <MdOutlineNavigateNext className="navigate-icon" />
        </a>

        <a href="#">
          <FiWifi className="list-icon" />
          Network Equipment
          <MdOutlineNavigateNext className="navigate-icon" />
        </a>

        <a href="#">
          <FiCamera className="list-icon" />
          Video Surveillance
          <MdOutlineNavigateNext className="navigate-icon" />
        </a>

        <a href="#">
          <FiCpu className="list-icon" />
          Computers
          <MdOutlineNavigateNext className="navigate-icon" />
        </a>

        <a href="#">
          <FiUser className="list-icon" />
          Office Equipment
          <MdOutlineNavigateNext className="navigate-icon" />
        </a>
      </div>

      <div className="category-modal-right">
        <div className="category-modal-right-panel">
          <div className="category-modal-title">
            Network Equipment
          </div>

          <div className="category-sublist">
            <a href="#">Switches</a>
            <a href="#">Wi-Fi Access Points</a>
            <a href="#">Media Converters</a>
            <a href="#">ADSL Routers</a>
            <a href="#">Network Adapters</a>
            <a href="#">Signal Repeaters</a>
          </div>
        </div>

        <div className="category-modal-preview">
          <img
            src="/wifi.png"
            alt="WiFi Router"
            className="category-preview-image"
          />
        </div>
      </div>
    </div>
  </div>
</div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;