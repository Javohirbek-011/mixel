import { useContext, useState } from "react";
import { FiShoppingCart, FiHeart, FiCheck, FiStar } from "react-icons/fi";
import { RiScalesFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { DataContext } from "../App";
import { addToCart, removeCartItem, addLike, removeLike } from "../services";
import "../styles/card.css";
import "../styles/skeleton.css";

// ─── Skeleton: Grid ──────────────────────────────────────────────
export function CardSkeleton() {
  return (
    <div className="card-skeleton">
      <div className="card-skeleton-img" />
      <div className="card-skeleton-body">
        <div className="card-skeleton-price" />
        <div className="card-skeleton-title" />
        <div className="card-skeleton-title-short" />
        <div className="card-skeleton-actions">
          <div className="card-skeleton-btn" />
          <div className="card-skeleton-btn" />
          <div className="card-skeleton-btn" />
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton: List ──────────────────────────────────────────────
export function CardListSkeleton() {
  return (
    <div className="list-card-skeleton">
      <div className="list-skel-img" />
      <div className="list-skel-body">
        <div className="list-skel-title" />
        <div className="list-skel-title short" />
        <div className="list-skel-meta" />
        <div className="list-skel-price" />
      </div>
      <div className="list-skel-actions" />
    </div>
  );
}

// ─── Shared hook ─────────────────────────────────────────────────
function useCardActions(data) {
  const navigate = useNavigate();
  const { token, cartItems, refreshCart, likedItems, refreshLikes } = useContext(DataContext);

  const [cartLoading, setCartLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const cartItem = cartItems.find((c) => c.product === data?.id);
  const likeItem = likedItems.find((l) => l.product === data?.id);
  const isInCart = !!cartItem;
  const isLiked = !!likeItem;

  const fmt = (p) => (p || p === 0 ? Number(p).toLocaleString("ru-RU") + " so'm" : "");

  const handleCart = async (e) => {
    e.preventDefault();
    if (!token) { navigate("/signup"); return; }
    if (cartLoading) return;
    setCartLoading(true);
    try {
      isInCart
        ? await removeCartItem(token, cartItem.id)
        : await addToCart(token, data.id, 1);
      await refreshCart(token);
    } finally { setCartLoading(false); }
  };

  const handleLike = async (e) => {
    e.preventDefault();
    if (!token) { navigate("/signup"); return; }
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      isLiked
        ? await removeLike(token, likeItem.id)
        : await addLike(token, data.id);
      await refreshLikes(token);
    } finally { setLikeLoading(false); }
  };

  return { isInCart, isLiked, cartLoading, likeLoading, handleCart, handleLike, fmt };
}

// ─── Grid Card ───────────────────────────────────────────────────
function Card({ data }) {
  const { isInCart, isLiked, cartLoading, likeLoading, handleCart, handleLike, fmt } =
    useCardActions(data);

  return (
    <div className="product-card">
      <div className="card-image">
        <Link to={`/product/${data?.id}`} className="image">
          <img src={data?.main_image} alt={data?.name} className="image" />
        </Link>
        {data?.discount && (
          <span className="card-discount-badge">-{data.discount}%</span>
        )}
      </div>

      <div className="card-details">
        <div className="card-info">
          <span className="price">{fmt(data?.discount_price || data?.price)}</span>
          {data?.discount_price && (
            <span className="original-price">{fmt(data?.price)}</span>
          )}
        </div>
        <h3 className="product-name">{data?.name || data?.details?.slice(0, 50)}</h3>
        <div className="card-actions">
          <button
            onClick={handleCart}
            className={`action-icon cart-btn ${isInCart ? "active-cart" : ""}`}
            title={isInCart ? "Savatchadan o'chirish" : "Savatchaga"}
            disabled={cartLoading}
          >
            {cartLoading ? <span className="btn-spinner" /> : isInCart ? <FiCheck /> : <FiShoppingCart />}
          </button>
          <button
            onClick={handleLike}
            className={`action-icon wishlist-btn ${isLiked ? "active-like" : ""}`}
            title={isLiked ? "Sevimlilardan o'chirish" : "Sevimlilarga"}
            disabled={likeLoading}
          >
            {likeLoading ? <span className="btn-spinner" /> : <FiHeart />}
          </button>
          <button onClick={(e) => e.preventDefault()} className="action-icon compare-btn" title="Solishtirish">
            <RiScalesFill />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── List Card ───────────────────────────────────────────────────
export function CardList({ data }) {
  const { isInCart, isLiked, cartLoading, likeLoading, handleCart, handleLike, fmt } =
    useCardActions(data);

  const brandName = data?.brand_name || "";
  const country = data?.country || "";
  const categoryName = data?.category_name || "";

  return (
    <div className="list-card">
      <Link to={`/product/${data?.id}`} className="list-card-img-wrap">
        {data?.discount && <span className="list-discount-badge">-{data.discount}%</span>}
        <img
          src={data?.main_image}
          alt={data?.name}
          className="list-card-img"
          onError={(e) => { e.target.src = "/telephone.png"; }}
        />
      </Link>

      <div className="list-card-body">
        <Link to={`/product/${data?.id}`} className="list-card-name">
          {data?.name || data?.details?.slice(0, 80)}
        </Link>

        <div className="list-card-meta">
          {brandName && <span><b>Brend:</b> {brandName}</span>}
          {country && <span><b>Davlat:</b> {country}</span>}
          {categoryName && <span><b>Turi:</b> {categoryName}</span>}
        </div>

        {data?.details && (
          <p className="list-card-desc">{data.details.slice(0, 120)}...</p>
        )}
      </div>

      <div className="list-card-right">
        <div className="list-card-prices">
          {data?.monthly_price && (
            <span className="list-monthly">
              {Number(data.monthly_price).toLocaleString("ru-RU")} so'm/oy
            </span>
          )}
          {data?.discount_price && (
            <span className="list-old-price">
              {Number(data.price).toLocaleString("ru-RU")} so'm
            </span>
          )}
          <span className="list-price">
            {fmt(data?.discount_price || data?.price)}
          </span>
        </div>

        <button
          onClick={handleCart}
          className={`list-cart-btn ${isInCart ? "in-cart" : ""}`}
          disabled={cartLoading}
        >
          {cartLoading ? (
            <span className="btn-spinner white" />
          ) : isInCart ? (
            <><FiCheck /> Savatchada</>
          ) : (
            <><FiShoppingCart /> Sotib olish</>
          )}
        </button>

        <div className="list-icon-btns">
          <button
            onClick={handleLike}
            className={`list-icon-btn ${isLiked ? "liked" : ""}`}
            disabled={likeLoading}
            title="Sevimlilarga"
          >
            {likeLoading ? <span className="btn-spinner" /> : <FiHeart />}
          </button>
          <button className="list-icon-btn" title="Solishtirish">
            <RiScalesFill />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
