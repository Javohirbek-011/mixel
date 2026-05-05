import React, { useState, useEffect, useContext, useCallback } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { FiChevronRight, FiChevronLeft, FiFilter, FiX, FiGrid, FiList } from "react-icons/fi";
import { DataContext } from "../App";
import { baseUrl } from "../services/config";
import Card, { CardSkeleton, CardList, CardListSkeleton } from "../components/Card";
import "../styles/categorypage.css";

const PAGE_SIZE = 12;

export default function CategoryPage() {
  const { id } = useParams();
  const location = useLocation();
  const isBrand = location.pathname.startsWith("/brands/");

  const { categoryData, brand } = useContext(DataContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"

  // Filters
  const [selectedCategory, setSelectedCategory] = useState(isBrand ? "" : id);
  const [selectedBrand, setSelectedBrand] = useState(isBrand ? id : "");
  const [sortBy, setSortBy] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  // Page title
  const currentCategory = categoryData?.results?.find((c) => String(c.id) === String(id));
  const currentBrand = brand?.results?.find((b) => String(b.id) === String(id));
  const pageTitle = isBrand
    ? currentBrand?.name || "Brand mahsulotlari"
    : currentCategory?.name || "Kategoriya mahsulotlari";

  const fetchProducts = useCallback(
    (page = 1, catId = selectedCategory, brandId = selectedBrand, sort = sortBy) => {
      setLoading(true);
      window.scrollTo({ top: 0, behavior: "instant" });

      const params = new URLSearchParams();
      params.set("page_size", PAGE_SIZE);
      params.set("page", page);
      if (catId) params.set("category", catId);
      if (brandId) params.set("brand", brandId);
      if (sort) params.set("ordering", sort);

      fetch(`${baseUrl}products/?${params.toString()}`)
        .then((r) => r.json())
        .then((data) => {
          setProducts(data?.results || []);
          setTotalCount(data?.count || 0);
          setTotalPages(data?.total_pages || Math.ceil((data?.count || 0) / PAGE_SIZE) || 1);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    },
    [selectedCategory, selectedBrand, sortBy]
  );

  // Reset page when id changes (new category/brand)
  useEffect(() => {
    const newCat = isBrand ? "" : id;
    const newBrand = isBrand ? id : "";
    setSelectedCategory(newCat);
    setSelectedBrand(newBrand);
    setCurrentPage(1);
    fetchProducts(1, newCat, newBrand, sortBy);
  }, [id, isBrand]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    fetchProducts(page, selectedCategory, selectedBrand, sortBy);
  };

  const handleCategoryFilter = (catId) => {
    const val = String(catId) === String(selectedCategory) ? "" : catId;
    setSelectedCategory(val);
    setCurrentPage(1);
    fetchProducts(1, val, selectedBrand, sortBy);
  };

  const handleBrandFilter = (brandId) => {
    const val = String(brandId) === String(selectedBrand) ? "" : brandId;
    setSelectedBrand(val);
    setCurrentPage(1);
    fetchProducts(1, selectedCategory, val, sortBy);
  };

  const handleSort = (val) => {
    setSortBy(val);
    setCurrentPage(1);
    fetchProducts(1, selectedCategory, selectedBrand, val);
  };

  // Pagination pages array
  const getPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  };

  const skeletons = Array(PAGE_SIZE).fill(0);

  return (
    <main className="cat-page">
      <div className="cat-container">
        {/* Breadcrumb */}
        <nav className="cat-breadcrumb">
          <Link to="/">Bosh sahifa</Link>
          <FiChevronRight />
          <span>{pageTitle}</span>
        </nav>

        <div className="cat-layout">
          {/* ── SIDEBAR ── */}
          <aside className={`cat-sidebar ${filterOpen ? "open" : ""}`}>
            <div className="sidebar-header">
              <h3>Filtr</h3>
              <button className="sidebar-close" onClick={() => setFilterOpen(false)}>
                <FiX />
              </button>
            </div>

            {/* Categories */}
            <div className="sidebar-section">
              <h4 className="sidebar-title">Kategoriyalar</h4>
              <div className="sidebar-list">
                {categoryData?.results?.map((cat) => (
                  <button
                    key={cat.id}
                    className={`sidebar-item ${String(selectedCategory) === String(cat.id) ? "active" : ""}`}
                    onClick={() => handleCategoryFilter(cat.id)}
                  >
                    {cat.icon && <img src={cat.icon} alt="" className="sidebar-cat-icon" />}
                    <span>{cat.name}</span>
                    {String(selectedCategory) === String(cat.id) && (
                      <FiX className="sidebar-item-x" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="sidebar-section">
              <h4 className="sidebar-title">Brendlar</h4>
              <div className="sidebar-list">
                {brand?.results?.map((b) => (
                  <button
                    key={b.id}
                    className={`sidebar-item ${String(selectedBrand) === String(b.id) ? "active" : ""}`}
                    onClick={() => handleBrandFilter(b.id)}
                  >
                    {b.image && <img src={b.image} alt={b.name} className="sidebar-brand-img" />}
                    <span>{b.name}</span>
                    {String(selectedBrand) === String(b.id) && (
                      <FiX className="sidebar-item-x" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Overlay for mobile */}
          {filterOpen && (
            <div className="sidebar-overlay" onClick={() => setFilterOpen(false)} />
          )}

          {/* ── MAIN CONTENT ── */}
          <div className="cat-main">
            {/* Toolbar */}
            <div className="cat-toolbar">
              <div className="cat-toolbar-left">
                <button className="filter-toggle-btn" onClick={() => setFilterOpen(true)}>
                  <FiFilter /> Filtr
                </button>
                <h1 className="cat-page-title">{pageTitle}</h1>
                {totalCount > 0 && (
                  <span className="cat-count">{totalCount} ta mahsulot</span>
                )}
              </div>
              <div className="cat-toolbar-right">
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                >
                  <option value="">Saralash</option>
                  <option value="price">Narx: arzondan qimmatga</option>
                  <option value="-price">Narx: qimmatdan arzonga</option>
                  <option value="-id">Yangi avval</option>
                  <option value="id">Eski avval</option>
                </select>
                <div className="view-toggle">
                  <button
                    className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                    onClick={() => setViewMode("grid")}
                    title="Grid"
                  ><FiGrid /></button>
                  <button
                    className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                    onClick={() => setViewMode("list")}
                    title="List"
                  ><FiList /></button>
                </div>
              </div>
            </div>

            {/* Active filters */}
            {(selectedCategory || selectedBrand) && (
              <div className="active-filters">
                {selectedCategory && categoryData?.results?.find((c) => String(c.id) === String(selectedCategory)) && (
                  <span className="active-filter-tag">
                    {categoryData.results.find((c) => String(c.id) === String(selectedCategory))?.name}
                    <button onClick={() => handleCategoryFilter(selectedCategory)}><FiX /></button>
                  </span>
                )}
                {selectedBrand && brand?.results?.find((b) => String(b.id) === String(selectedBrand)) && (
                  <span className="active-filter-tag">
                    {brand.results.find((b) => String(b.id) === String(selectedBrand))?.name}
                    <button onClick={() => handleBrandFilter(selectedBrand)}><FiX /></button>
                  </span>
                )}
              </div>
            )}

            {/* Products grid/list */}
            <div className={viewMode === "grid" ? "cat-products-grid" : "cat-products-list"}>
              {loading ? (
                viewMode === "grid"
                  ? skeletons.map((_, i) => <CardSkeleton key={i} />)
                  : skeletons.map((_, i) => <CardListSkeleton key={i} />)
              ) : products.length > 0 ? (
                viewMode === "grid"
                  ? products.map((item) => <Card key={item.id} data={item} />)
                  : products.map((item) => <CardList key={item.id} data={item} />)
              ) : (
                <div className="cat-empty">
                  <p>Mahsulot topilmadi</p>
                  <button
                    className="cat-reset-btn"
                    onClick={() => {
                      setSelectedCategory(isBrand ? "" : id);
                      setSelectedBrand(isBrand ? id : "");
                      setSortBy("");
                      setCurrentPage(1);
                      fetchProducts(1, isBrand ? "" : id, isBrand ? id : "", "");
                    }}
                  >
                    Filtrni tozalash
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn page-prev"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <FiChevronLeft />
                </button>

                {getPages().map((page, i) =>
                  page === "..." ? (
                    <span key={`dots-${i}`} className="page-dots">···</span>
                  ) : (
                    <button
                      key={page}
                      className={`page-btn ${currentPage === page ? "active" : ""}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  className="page-btn page-next"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <FiChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
