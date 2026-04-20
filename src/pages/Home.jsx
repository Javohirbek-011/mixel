import React, { useContext, useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { sliderImgs } from "../services";
import Card from "../components/Card";
import "../styles/home.css";
import { DataContext } from "../App";

function Home() {
  const [images, setImages] = useState([]);

  const {
    product,
    setProduct,
    categoryData,
    setCategoryData,
    token,
    setToken,
    brand,
    setBrand,
  } = useContext(DataContext);

  useEffect(() => {
    let mounted = true;
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
        .slice(0, 3);
      setImages(urls);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <main className="home-page">
        <section className="hero-slider-section">
          <div className="container">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 4500, disableOnInteraction: false }}
              loop={true}
              className="home-swiper"
            >
              {images.length
                ? images.map((src, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={src}
                        alt={`Slide ${index + 1}`}
                        className="slider-image"
                      />
                    </SwiperSlide>
                  ))
                : [1, 2, 3].map((placeholder) => (
                    <SwiperSlide key={placeholder}>
                      <div className="slider-placeholder">Loading image...</div>
                    </SwiperSlide>
                  ))}
            </Swiper>
          </div>
        </section>
        <section className="hot-deals-section">
          <div className="container">
            <div className="section-header">
              <h2>Hot Deals</h2>
              <a href="#all" className="view-all">
                View all →
              </a>
            </div>

            <div className="products-grid">
              {product?.results && product.results.length > 0
                ? product.results.map((item) => {
                    return <Card key={item.id} data={item} />;
                  })
                : " "}
            </div>
          </div>
        </section>
        <section className="category-section">
          <div className="container">
            <div className="section-header">
              <h2>Popular Categories</h2>
            </div>

            <div className="category-cards">
              <Marquee gradient={false} speed={50}>
                {categoryData?.results?.map((item) => (
                  <div key={item.id} className="category-card">
                    <h3>{item.name}</h3>
                    <div className="circle"></div>
                    <img src={item.image} alt="" />
                  </div>
                ))}
              </Marquee>
            </div>
          </div>
        </section>
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

        <section className="section-cheaper">
          <div className="container">
            <div className="title">
              <h1>Cheaper products</h1>
              <a href="#all" className="view-all">
                View all →
              </a>
            </div>
            <div className="cards">
              <div className="products-grid">
                {product?.results && product.results.length > 0
                  ? product.results.slice(0, 10).map((item) => {
                      return <Card key={item.id} data={item} />;
                    })
                  : " "}
              </div>
            </div>
          </div>
        </section>

        <section className="recommendation">
          <div className="container">
            <div className="title">
              <h1>Recommendation</h1>
              <a href="#all" className="view-all">
                View all →
              </a>
            </div>

            <div className="cards">
              <div className="img">
                <img src="/rek.png" alt="" />
              </div>

              {product?.results?.slice(0, 8).map((item) => {
                return <Card key={item.id || Math.random()} data={item} />;
              })}
            </div>
          </div>
        </section>
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
                {brand?.results?.map((item) => {
                  return (
                    <div className="brand-card">
                      <img src={item.image} alt="" />
                    </div>
                  );
                })}
              </Marquee>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;
