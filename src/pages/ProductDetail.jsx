import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiShoppingCart,
  FiHeart,
  FiChevronRight,
  FiTruck,
  FiRefreshCw,
  FiPhone,
  FiCreditCard,
  FiCheck,
} from "react-icons/fi";
import { RiScalesFill } from "react-icons/ri";
import { MdVerified } from "react-icons/md";
import { DataContext } from "../App";
import { baseUrl } from "../services/config";
import { addToCart, removeCartItem, addLike, removeLike } from "../services";
import Card, { CardSkeleton } from "../components/Card";
import "../styles/productdetail.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, cartItems, refreshCart, likedItems, refreshLikes } = useContext(DataContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("specs");
  const [cartLoading, setCartLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  // Check cart/like status
  const cartItem = cartItems.find((c) => c.product === parseInt(id));
  const likeItem = likedItems.find((l) => l.product === parseInt(id));
  const isInCart = !!cartItem;
  const isLiked = !!likeItem;

  useEffect(() => {
    setLoading(true);
    setSelectedImage(null);
    setSimilarProducts([]);
    fetch(`${baseUrl}products/${id}/`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data);
        setSelectedImage(data.main_image || data.images?.[0]?.image || null);
        setLoading(false);
        if (data.category) {
          fetch(`${baseUrl}products/?category=${data.category}&page_size=9`)
            .then((r) => r.json())
            .then((res) => {
              const items = res?.results || res || [];
              setSimilarProducts(
                items.filter((p) => p.id !== data.id).slice(0, 8),
              );
            })
            .catch(() => {});
        }
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleCartAction = async () => {
    if (!token) { navigate("/signup"); return; }
    if (cartLoading) return;
    setCartLoading(true);
    try {
      if (isInCart) {
        await removeCartItem(token, cartItem.id);
      } else {
        await addToCart(token, parseInt(id), 1);
      }
      await refreshCart(token);
    } finally {
      setCartLoading(false);
    }
  };

  const handleLikeAction = async () => {
    if (!token) { navigate("/signup"); return; }
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      if (isLiked) {
        await removeLike(token, likeItem.id);
      } else {
        await addLike(token, parseInt(id));
      }
      await refreshLikes(token);
    } finally {
      setLikeLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return "—";
    return Number(price).toLocaleString("ru-RU") + " so'm";
  };

  if (loading) {
    return (
      <div className="pd-loading">
        <div className="pd-spinner" />
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product || product.detail) {
    return (
      <div className="pd-not-found">
        <h2>Product not found</h2>
        <Link to="/">← Back to Home</Link>
      </div>
    );
  }

  const allImages = product.images?.length
    ? product.images.map((img) => img.image)
    : product.main_image
      ? [product.main_image]
      : [];

  return (
    <main className="pd-page">
      <div className="pd-container">
        {/* BREADCRUMB */}
        <nav className="pd-breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight />
          {product.category_name && (
            <>
              <Link to={`/categories/${product.category}`}>
                {product.category_name}
              </Link>
              <FiChevronRight />
            </>
          )}
          <span>{product.name}</span>
        </nav>

        {/* MAIN SECTION */}
        <div className="pd-main">
          {/* IMAGE GALLERY */}
          <div className="pd-gallery">
            <div className="pd-thumbnails">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  className={`pd-thumb ${selectedImage === img ? "active" : ""}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt={`view ${i + 1}`} />
                </button>
              ))}
            </div>
            <div className="pd-main-img-wrap">
              <img
                src={selectedImage}
                alt={product.name}
                className="pd-main-img"
              />
              {product.discount_price && (
                <span className="pd-discount-badge">
                  -
                  {Math.round(
                    (1 - product.discount_price / product.price) * 100,
                  )}
                  %
                </span>
              )}
            </div>
          </div>

          <div className="pd-info">
            <div className="pd-info-header">
              {product.country && (
                <span className="pd-country">{product.country}</span>
              )}
              <h1 className="pd-title">{product.name}</h1>
            </div>

            <div className="pd-price-block">
              <div className="pd-price-row">
                <span className="pd-price">
                  {formatPrice(product.discount_price || product.price)}
                </span>
                {product.discount_price && (
                  <span className="pd-price-old">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              {product.monthly_price && (
                <div className="pd-monthly">
                  <FiCreditCard />
                  <span>
                    From <strong>{formatPrice(product.monthly_price)}</strong>
                    /month installment
                  </span>
                </div>
              )}
              {product.is_cash && (
                <div className="pd-vip">
                  <MdVerified />
                  <span>VIP discounts for VIP clients</span>
                </div>
              )}
            </div>

            <div className="pd-actions">
              <button
                className={`pd-btn-cart ${isInCart ? "added" : ""}`}
                onClick={handleCartAction}
                disabled={cartLoading}
              >
                {cartLoading ? (
                  <span className="pd-btn-spinner" />
                ) : isInCart ? (
                  <><FiCheck /> Savatchada</>
                ) : (
                  <><FiShoppingCart /> SAVATCHAGA</>
                )}
              </button>
              <button className="pd-btn-installment">
                BO'LIB TO'LASH
              </button>
            </div>

            <div className="pd-icon-actions">
              <button
                className={`pd-icon-btn ${isLiked ? "pd-icon-liked" : ""}`}
                onClick={handleLikeAction}
                disabled={likeLoading}
              >
                {likeLoading ? <span className="pd-btn-spinner-sm" /> : <FiHeart />}
                <span>{isLiked ? "Sevimlilardan o'chirish" : "Sevimlilarga"}</span>
              </button>
              <button className="pd-icon-btn">
                <RiScalesFill /> <span>Solishtirish</span>
              </button>
            </div>

            <div className="pd-benefits">
              <div className="pd-benefit">
                <div className="pd-benefit-icon">
                  <FiRefreshCw />
                </div>
                <div className="pd-benefit-text">
                  <strong>30 days for return.</strong>
                  <p>If you buy today, you can return until May 6.</p>
                </div>
              </div>
              <div className="pd-benefit">
                <div className="pd-benefit-icon">
                  <FiPhone />
                </div>
                <div className="pd-benefit-text">
                  <strong>Support 24/7</strong>
                  <p>Phone: +998 99 990 45 27 · Telegram: @mixel_uz</p>
                </div>
              </div>
              <div className="pd-benefit">
                <div className="pd-benefit-icon">
                  <FiTruck />
                </div>
                <div className="pd-benefit-text">
                  <strong>Delivery</strong>
                  <p className="pd-free">Free Shipping</p>
                </div>
              </div>
              <div className="pd-benefit">
                <div className="pd-benefit-icon">
                  <FiCreditCard />
                </div>
                <div className="pd-benefit-text">
                  <strong>Payment:</strong>
                  <p>Cash on delivery · Payme / Click · Bank transfer</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pd-tabs-section">
          <div className="pd-tabs">
            <button
              className={`pd-tab ${activeTab === "specs" ? "active" : ""}`}
              onClick={() => setActiveTab("specs")}
            >
              Technical Parameters
            </button>
            <button
              className={`pd-tab ${activeTab === "desc" ? "active" : ""}`}
              onClick={() => setActiveTab("desc")}
            >
              Description
            </button>
          </div>

          <div className="pd-tab-content">
            {activeTab === "specs" && (
              <div className="pd-specs">
                {product.properties?.length > 0 ? (
                  product.properties.map((group) => (
                    <div key={group.id} className="pd-spec-group">
                      <h3 className="pd-spec-group-title">{group.title}</h3>
                      <table className="pd-spec-table">
                        <tbody>
                          {group.value?.map((row, i) => (
                            <tr key={i}>
                              <td className="pd-spec-type">{row.type}</td>
                              <td className="pd-spec-value">{row.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))
                ) : (
                  <p className="pd-no-specs">No specifications available.</p>
                )}
              </div>
            )}
            {activeTab === "desc" && (
              <div className="pd-desc">
                <p>{product.details || "No description available."}</p>
              </div>
            )}
          </div>
        </div>

        {similarProducts.length > 0 && (
          <section className="pd-similar">
            <div className="pd-similar-header">
              <h2>Similar Products</h2>
              {product.category && (
                <Link
                  to={`/categories/${product.category}`}
                  className="pd-view-all"
                >
                  View all →
                </Link>
              )}
            </div>
            <div className="pd-similar-grid">
              {similarProducts.map((item) => (
                <Card key={item.id} data={item} />
              ))}
            </div>          </section>
        )}
      </div>
    </main>
  );
}

export default ProductDetail;
