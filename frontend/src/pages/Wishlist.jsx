
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import api from "../services/api";

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await api.get("/wishlist");
      const data = res.data;
      setItems(Array.isArray(data) ? data : data.items || []);
    } catch (err) {
      console.error("Wishlist error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeItem = async (productId) => {
    try {
      await api.post("/wishlist/toggle", { productId });
      await fetchWishlist();
    } catch {
      alert("Could not update wishlist.");
    }
  };

  if (loading) return <div className="loading">Loading wishlist...</div>;

  return (
    <main className="products-page">
      <h1><Heart /> My Wishlist</h1>

      {items.length === 0 ? (
        <div className="empty-products">
          <h2>Your wishlist is empty</h2>
          <Link to="/products">Explore Products</Link>
        </div>
      ) : (
        <div className="product-grid">
          {items.map((item) => {
            const product = item.product || item;
            const id = product._id || item.productId;

            return (
              <div className="product-card" key={id}>
                <img src={product.image} alt={product.name} />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>₹{product.price}</p>
                  <Link to={`/products/${id}`}>View Product</Link>
                  <button onClick={() => removeItem(id)}>
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
