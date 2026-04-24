import React, { useState, useContext, useEffect, useRef } from "react";
import { IoLocationSharp } from "react-icons/io5";
import {
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiSearch,
  FiMenu,
  FiSmartphone,
  FiLogOut,
  FiChevronRight,
  FiX,
} from "react-icons/fi";
import { RiScalesFill } from "react-icons/ri";
import "../styles/navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { DataContext } from "../App";
import { baseUrl } from "../services/config";

function Navbar() {
  const [categoryModal, setCategoryModal] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const hoverTimeout = useRef(null);

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const searchTimeout = useRef(null);
  const navigate = useNavigate();

  const { token, setToken, categoryData } = useContext(DataContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserModal(false);
  };

  const handleCategoryHover = (category) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHoveredCategory(category);
    setLoadingProducts(true);
    setCategoryProducts([]);
    fetch(`${baseUrl}products/?category=${category.id}`)
      .then((r) => r.json())
      .then((data) => {
        const items = data?.results || data || [];
        setCategoryProducts(items.slice(0, 8));
        setLoadingProducts(false);
      })
      .catch(() => setLoadingProducts(false));
  };

  const closeModal = () => {
    setCategoryModal(false);
    setHoveredCategory(null);
    setCategoryProducts([]);
  };

  const handleModalLeave = () => {
    hoverTimeout.current = setTimeout(closeModal, 250);
  };

  const handleModalEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
  };

  // Search handlers
  const handleSearchInput = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!val.trim()) {
      setSearchResults([]);
      setSearchOpen(true);
      return;
    }
    setSearchLoading(true);
    setSearchOpen(true);
    searchTimeout.current = setTimeout(() => {
      fetch(`${baseUrl}products/?search=${encodeURIComponent(val)}&page_size=8`)
        .then((r) => r.json())
        .then((data) => {
          setSearchResults(data?.results || data || []);
          setSearchLoading(false);
        })
        .catch(() => setSearchLoading(false));
    }, 350);
  };

  const handleSearchFocus = () => {
    setSearchOpen(true);
  };

  const handleSearchSelect = (productId) => {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    navigate(`/product/${productId}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchOpen(false);
  };

  // Close search on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, []);

  const bannerProduct = categoryProducts[0] || null;

  const formatPrice = (price) => {
    if (!price) return "";
    return Number(price).toLocaleString("ru-RU") + " сум";
  };

  return (
    <>
      <div className="navbar-top">
        <div className="nb-container">
          <div className="navbar-top-content">
            <div className="navbar-top-left">
              <IoLocationSharp />
              <span>Tashkent</span>
            </div>
            <div className="navbar-top-center">
              <span>Our Stores</span>
              <span>B2B Sales</span>
              <span>Installment</span>
              <span>Payment</span>
              <span>Warranty</span>
            </div>
            <div className="navbar-top-right">
              <a href="tel:+998883690201" className="phone-link">
                <FiSmartphone />
                <span>+998 88 369 02 01</span>
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
        <div className="nb-container">
          <div className="navbar-main">
            <Link to="/" className="navbar-brand">
              <img src="/navbarlogo.png" alt="Logo" />
            </Link>

            <div className="navbar-search" ref={searchRef}>
              <form className="search-form" onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchInput}
                  onFocus={handleSearchFocus}
                  className="search-input"
                  autoComplete="off"
                />
                <button type="submit" className="search-btn">
                  <FiSearch />
                </button>
              </form>

              {searchOpen && (
                <div className="search-dropdown">
                  {searchLoading ? (
                    <div className="search-loading">
                      <div className="search-spinner" />
                      <span>Searching...</span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <>
                      {searchResults.map((item) => (
                        <button
                          key={item.id}
                          className="search-result-item"
                          onClick={() => handleSearchSelect(item.id)}
                        >
                          <div className="search-result-img">
                            <img
                              src={item.main_image || item.images?.[0]?.image}
                              alt={item.name}
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          </div>
                          <div className="search-result-info">
                            <p className="search-result-name">
                              {item.details?.slice(0, 90) || item.name}
                              {item.details?.length > 90 ? "..." : ""}
                            </p>
                            <span className="search-result-price">
                              {formatPrice(item.discount_price || item.price)}
                            </span>
                          </div>
                        </button>
                      ))}
                    </>
                  ) : searchQuery.trim() ? (
                    <div className="search-empty">
                      <FiSearch />
                      <span>No products found for "{searchQuery}"</span>
                    </div>
                  ) : (
                    <div className="search-placeholder">
                      <span>Mahsulot nomini kiriting...</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="navbar-actions">
              {!token ? (
                <Link to="/signup" className="action-btn">
                  <FiUser className="action-icon-svg" />
                  <span>User</span>
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
                    <FiUser className="action-icon-svg" />
                    <span>User</span>
                  </button>
                  {userModal && (
                    <div className="account-modal">
                      <Link to="/account" className="modal-item">
                        <FiUser /> <span>Profile</span>
                      </Link>
                      <button
                        className="modal-item logout-btn"
                        onClick={handleLogout}
                      >
                        <FiLogOut /> <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button className="action-btn">
                <RiScalesFill className="action-icon-svg" />
                <span>Compare</span>
              </button>

              <button className="action-btn">
                <FiHeart className="action-icon-svg" />
                <span>Favorites</span>
              </button>

              <Link to="/cart" className="cart-link">
                <button className="action-btn cart-btn">
                  <FiShoppingCart className="action-icon-svg" />
                  <span className="cart-badge">2</span>
                  <span>Basket</span>
                </button>
              </Link>
            </div>
          </div>

          <div className="navbar-menu">
            <button
              className={`menu-btn ${categoryModal ? "active" : ""}`}
              onClick={() => {
                const next = !categoryModal;
                setCategoryModal(next);
                setUserModal(false);
                if (next && categoryData?.results?.length) {
                  handleCategoryHover(categoryData.results[0]);
                }
              }}
            >
              <FiMenu />
              <span>CATEGORIES</span>
            </button>

            <div className="navbar-links">
              {categoryData?.results?.map((item) => (
                <Link key={item.id} to={`/categories/${item.id}`}>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {categoryModal && (
          <div
            className="mega-panel container"
            onMouseLeave={handleModalLeave}
            onMouseEnter={handleModalEnter}
          >
            <button className="mega-close" onClick={closeModal}>
              <FiX />
            </button>

            <div className="mega-left">
              <p className="mega-left-title">ALL CATEGORIES</p>
              {categoryData?.results?.map((item) => (
                <div
                  key={item.id}
                  className={`mega-cat-row ${hoveredCategory?.id === item.id ? "active" : ""}`}
                  onMouseEnter={() => handleCategoryHover(item)}
                >
                  {item.icon ? (
                    <img src={item.icon} alt="" className="mega-cat-icon" />
                  ) : (
                    <span className="mega-cat-dot" />
                  )}
                  <span className="mega-cat-name">{item.name}</span>
                  <FiChevronRight className="mega-cat-arrow" />
                </div>
              ))}
            </div>

            <div className="mega-middle">
              {hoveredCategory && (
                <>
                  <div className="mega-middle-header">
                    <h3>{hoveredCategory.name}</h3>
                    <Link
                      to={`/categories/${hoveredCategory.id}`}
                      className="mega-view-all"
                      onClick={closeModal}
                    >
                      View all <FiChevronRight />
                    </Link>
                  </div>
                  <div className="mega-products-list">
                    {loadingProducts ? (
                      Array(6)
                        .fill(0)
                        .map((_, i) => (
                          <div key={i} className="mega-product-skel" />
                        ))
                    ) : categoryProducts.length > 0 ? (
                      categoryProducts.map((p) => (
                        <Link
                          key={p.id}
                          to={`/product/${p.id}`}
                          className="mega-product-row"
                          onClick={closeModal}
                        >
                          <span className="mega-row-dot" />
                          <span className="mega-row-name">
                            {p.name || p.details?.slice(0, 55) || "Product"}
                          </span>
                        </Link>
                      ))
                    ) : (
                      <p className="mega-empty">No products found</p>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="mega-banner">
              {hoveredCategory?.image && (
                <div className="mega-banner-img-wrap">
                  <img
                    src={hoveredCategory.image}
                    alt={hoveredCategory.name}
                    className="mega-banner-img"
                  />
                </div>
              )}
              {bannerProduct && (
                <div className="mega-banner-card">
                  <p className="mega-banner-label">SPECIAL OFFER</p>
                  <p className="mega-banner-title">
                    {bannerProduct.name || bannerProduct.details?.slice(0, 40)}
                  </p>
                  <p className="mega-banner-from">
                    from {bannerProduct.price} sum
                  </p>
                  <Link
                    to={`/product/${bannerProduct.id}`}
                    className="mega-banner-btn"
                    onClick={closeModal}
                  >
                    Shop now →
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
