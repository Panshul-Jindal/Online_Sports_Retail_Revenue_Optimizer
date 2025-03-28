import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/products?page=${page}&limit=20`
      );
      if (response.data.length === 0) {
        setHasMore(false); // No more products to load
      } else {
        setProducts((prevProducts) => [...prevProducts, ...response.data]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const loadMore = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="home">
        <div className="home__container">
          <img
            className="home__image"
            src="https://images-eu.ssl-images-amazon.com/images/G/02/digital/video/merch2016/Hero/Covid19/Generic/GWBleedingHero_ENG_COVIDUPDATE__XSite_1500x600_PV_en-GB._CB428684220_.jpg"
            alt="Banner"
          />
          <div className="home__row">
            {products.map((product) => (
              <div className="product-card" key={product.product_id}>
                <img
                  src="https://via.placeholder.com/150" // Replace with actual image URL if available
                  alt={product.name}
                />
                <h3>{product.name}</h3>
                <p className="price">₹{product.selling_price}</p>
                <p className="rating">⭐ {product.average_rating}</p>
              </div>
            ))}
          </div>
          {loading && <div>Loading...</div>}
          {hasMore && (
            <button className="load-more-button" onClick={loadMore}>
              Load More
            </button>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
