import React, { useContext, useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { sliderImgs } from "../services";
import Card, { CardSkeleton } from "../components/Card";
import "../styles/home.css";
import "../styles/skeleton.css";
import { DataContext } from "../App";

function Home() {
  const [images, setImages] = useState([]);
  const [sliderLoading, setSliderLoading] = useState(true);

  const { product, productLoading, categoryData, brand } = useContext(DataContext);

  useEffect(() => {
    let mounted = true;
    setSliderLoading(true);
    sliderImgs().then((result) => {
      if (!mounted) return;
      const items = Array.isArray(result)
        ? result
        : result?.results || result?.data || [];
      const urls = items
        .map((item) => {
          if (!item) return "";
          if (typeof item === "string") return item;
          return item.image || item.img || "";
        })
        .filter(Boolean)
        .slice(0, 5);
      setImages(urls);
      setSliderLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const skeletonCards = Array(8).fill(0);

  return (
    <main className="home-page">
      {/* ── HERO SLIDER ── */}
      <section className="hero-slider-section">
        <div className="container">
          {sliderLoading ? (
            <div className="slider-skeleton">
              <div className="slider-skeleton-inner">
                <div className="slider-skeleton-bar" style={{ width: 260 }} />
                <div className="slider-skeleton-bar" style={{ width: 180 }} />
              </div>
            </div>
          ) : (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 4500, disableOnInteraction: false }}
              loop={images.length > 1}
              className="home-swiper"
            >
              {images.length > 0 ? (
                images.map((src, index) => (
                  <SwiperSlide key={index}>
                    <img src={src} alt={`Slide ${index + 1}`} className="slider-image" />
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <div className="slider-placeholder">No images available</div>
                </SwiperSlide>
              )}
            </Swiper>
          )}
        </div>
      </section>

      {/* ── HOT DEALS ── */}
      <section className="hot-deals-section">
        <div className="container">
          <div className="section-header">
            <h2>Hot Deals</h2>
            <a href="#all" className="view-all">View all →</a>
          </div>
          <div className="products-grid">
            {productLoading
              ? skeletonCards.map((_, i) => <CardSkeleton key={i} />)
              : product?.results?.map((item) => <Card key={item.id} data={item} />)}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="category-section">
        <div className="container">
          <div className="section-header">
            <h2>Popular Categories</h2>
          </div>
          <div className="category-cards">
            <Marquee gradient={false} speed={50}>
              {categoryData?.results?.map((item) => (
                <Link key={item.id} to={`/categories/${item.id}`} className="category-card" style={{ textDecoration: "none" }}>
                  <h3>{item.name}</h3>
                  <div className="circle"></div>
                  <img src={item.image} alt="" />
                </Link>
              ))}
            </Marquee>
          </div>
        </div>
      </section>

      {/* ── IPHONE PROMO ── */}
      <section className="section-iphone">
        <div className="container">
          <div className="title">
            <h1>Apple iPhone X 64 GB</h1>
            <p>
              The brand new 5.8-inch Super Retina display, which fits
              comfortably in your hand and looks stunning, is the iPhone X.
            </p>
          </div>
          <div className="img">
            <img src="/telephone.png" alt="" />
          </div>
          <div className="price">
            <h1>1 250 900 So'm</h1>
            <p>2 220 900 So'm</p>
            <button>Show more</button>
          </div>
        </div>
      </section>

      {/* ── CHEAPER PRODUCTS ── */}
      <section className="section-cheaper">
        <div className="container">
          <div className="title">
            <h1>Cheaper products</h1>
            <a href="#all" className="view-all">View all →</a>
          </div>
          <div className="cards">
            <div className="products-grid">
              {productLoading
                ? skeletonCards.slice(0, 6).map((_, i) => <CardSkeleton key={i} />)
                : product?.results?.slice(0, 10).map((item) => <Card key={item.id} data={item} />)}
            </div>
          </div>
        </div>
      </section>

      {/* ── RECOMMENDATION ── */}
      <section className="recommendation">
        <div className="container">
          <div className="title">
            <h1>Recommendation</h1>
            <a href="#all" className="view-all">View all →</a>
          </div>
          <div className="cards">
            <div className="img">
              <img src="/rek.png" alt="" />
            </div>
            {productLoading
              ? skeletonCards.slice(0, 8).map((_, i) => <CardSkeleton key={i} />)
              : product?.results?.slice(0, 8).map((item) => (
                  <Card key={item.id} data={item} />
                ))}
          </div>
        </div>
      </section>

      {/* ── BRANDS ── */}
      <section className="brands-section">
        <div className="container">
          <div className="brands-header">
            <h2>Brands</h2>
            <div className="arrows">
              <span>&larr;</span>
              <span>&rarr;</span>
            </div>
          </div>
          <div className="brands-grid">
            <Marquee>
              {brand?.results?.map((item, i) => (
                <Link key={i} to={`/brands/${item.id}`} className="brand-card" style={{ textDecoration: "none" }}>
                  <img src={item.image} alt={item.name} />
                </Link>
              ))}
            </Marquee>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
