import React from "react";
import { FiInstagram, FiFacebook, FiYoutube } from "react-icons/fi";
import { FaTelegramPlane } from "react-icons/fa";
import "../styles/footer.css"
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <img src="/logo.png" alt="logo" className="footer-logo" />

          <p className="footer-text">
            Working hours of call center:
            <br />
            Monday - Saturday: 9:00 - 18:00
          </p>

          <p className="footer-text">
            Call center:
            <br />
            +998 (71) 205-93-93
          </p>

          <div className="footer-socials">
            <a href="#">
              <FaTelegramPlane />
            </a>
            <a href="#">
              <FiInstagram />
            </a>
            <a href="#">
              <FiFacebook />
            </a>
            <a href="#">
              <FiYoutube />
            </a>
          </div>
        </div>

        <div className="footer-columns">
          <div className="footer-col">
            <h3>Categories</h3>
            <a href="#">Laptops</a>
            <a href="#">Gaming Chairs</a>
            <a href="#">Phones</a>
            <a href="#">Monoblocks</a>
            <a href="#">Memory Modules</a>
          </div>

          <div className="footer-col">
            <h3>General</h3>
            <a href="#">News</a>
            <a href="#">About Us</a>
            <a href="#">Our Stores</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Loyalty Program</a>
            <a href="#">Contacts</a>
          </div>

          <div className="footer-col">
            <h3>For Customers</h3>
            <a href="#">Installment Purchase</a>
            <a href="#">Delivery & Payment</a>
            <a href="#">Cashback Rules</a>
            <a href="#">Return / Exchange</a>
            <a href="#">Coupon Rules</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
