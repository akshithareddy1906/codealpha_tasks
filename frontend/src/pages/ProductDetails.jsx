
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Product loading failed:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await api.post("/cart", { productId: id, quantity: 1 });
      alert("Product added to cart!");
    } catch (err) {
      alert(err.response?.data?.message || "Could not add product.");
    }
  };

  if (loading) return <div className="loading">Loading product...</div>;
  if (!product) return <div className="loading">Product not found.</div>;

  return (
    <div className="products-page">
      <button onClick={() => navigate("/products")}>
        <ArrowLeft size={18} /> Back to Products
      </button>

      <div className="product-details">
        <img src={product.image} alt={product.name} />
        <div>
          <span className="section-label">{product.category}</span>
          <h1>{product.name}</h1>
          <h2>₹{product.price}</h2>
          <p>{product.description}</p>
          <button onClick={addToCart}>
            <ShoppingCart size={18} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
