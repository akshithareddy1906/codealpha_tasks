
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Search } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState([]);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!user) {
      setWishlistIds([]);
      return;
    }

    const fetchWishlist = async () => {
      try {
        const response = await api.get("/wishlist");
        const data = response.data;
        const items = Array.isArray(data) ? data : data.items || [];

        setWishlistIds(
          items
            .map((item) => item.product?._id || item.productId?._id || item.productId || item._id)
            .filter((id) => typeof id === "string")
        );
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      }
    };

    fetchWishlist();
  }, [user]);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    if (!user) {
      alert("Please login to add products to cart.");
      navigate("/login");
      return;
    }

    try {
      await api.post("/cart", { productId, quantity: 1 });
      alert("Product added to cart 🛒");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add product");
    }
  };

  const addToWishlist = async (productId) => {
    if (!user) {
      alert("Please login to use wishlist.");
      navigate("/login");
      return;
    }

    try {
      await api.post("/wishlist/toggle", { productId });

      setWishlistIds((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId]
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update wishlist");
    }
  };

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = (product.name || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <div>
          <span className="section-label">OUR COLLECTION</span>
          <h1>Explore Products</h1>
          <p>Find something you'll love from our collection.</p>
        </div>

        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="category-bar">
        {categories.map((item) => (
          <button
            key={item}
            className={category === item ? "active-category" : ""}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-products">
          <h2>No products found</h2>
          <p>Try another search or category.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => {
            const isWishlisted = wishlistIds.includes(product._id);

            return (
              <div className="product-card" key={product._id}>
                <div className="product-image-wrapper">
                  <img src={product.image} alt={product.name} />

                  <button
                    className={`wishlist-button ${
                      isWishlisted ? "wishlisted" : ""
                    }`}
                    onClick={() => addToWishlist(product._id)}
                    aria-label={
                      isWishlisted
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                    title={
                      isWishlisted
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                  >
                    <Heart
                      size={19}
                      fill={isWishlisted ? "red" : "none"}
                      color={isWishlisted ? "red" : "currentColor"}
                    />
                  </button>
                </div>

                <div className="product-info">
                  <span className="product-category">
                    {product.category}
                  </span>

                  <Link
                    to={`/products/${product._id}`}
                    className="product-name"
                  >
                    {product.name}
                  </Link>

                  <p className="product-description">
                    {product.description}
                  </p>

                  <div className="product-bottom">
                    <strong>₹{product.price}</strong>

                    <button onClick={() => addToCart(product._id)}>
                      <ShoppingCart size={17} />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Products;
