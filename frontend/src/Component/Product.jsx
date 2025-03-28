// import React, { useEffect, useState } from "react";
// import { fetchProducts } from "../App"; // Import the API function

// const Products = () => {
//   const [products, setProducts] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const getProducts = async () => {
//       try {
//         const data = await fetchProducts();
//         setProducts(data);
//       } catch (err) {
//         setError("Failed to fetch products.");
//       }
//     };

//     getProducts();
//   }, []);

//   return (
//     <div>
//       <h1>Products</h1>
//       {error && <p>{error}</p>}
//       {products.length > 0 ? (
//         <ul>
//           {products.map((product) => (
//             <li key={product.id}>{product.name}</li> // Adjust fields as per API response
//           ))}
//         </ul>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// };

// export default Products;



import React from "react";
import "./Product.css";

function Product({ id, title, image, price, rating }) {
 
  return (
    <div className="product">
      <div className="product__info">
        <p>{title}</p>
        <p className="product__price">
          <small>$</small>
          <strong>{price}</strong>
        </p>
        <div className="product__rating">
          {Array(rating)
            .fill()
            .map((_, i) => (
              <p>🌟</p>
            ))}
        </div>
      </div>

      <img src={image} alt="" />

      <button>Add to Basket</button>
    </div>
  );
}

export default Product;
