import React, { useContext } from "react";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import { RiScalesFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";

import "../styles/card.css";

function Card({ data }) {
  const navigate = useNavigate();

  const handleAction = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signup");
      return;
    }

    console.log("Action allowed");
  };
  return (
    <div className="product-card">
      <div className="card-image">
        <Link to={`/product/${data?.id}`} className="image">
          <img src={data?.main_image} alt={data?.name} className="image" />
        </Link>
      </div>

      <div className="card-details">
        <div className="card-info">
          <span className="price">{data?.price}</span>
        </div>

        <h3 className="product-name">{data?.details?.slice(0, 50)}...</h3>

        <div className="card-actions">
          <button
            onClick={handleAction}
            className="action-icon cart-btn"
            title="Add to cart"
          >
            <FiShoppingCart />
          </button>
          <button
            onClick={handleAction}
            className="action-icon wishlist-btn"
            title="Add to wishlist"
          >
            <FiHeart />
          </button>
          <button
            onClick={handleAction}
            className="action-icon compare-btn"
            title="Compare"
          >
            <RiScalesFill />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
