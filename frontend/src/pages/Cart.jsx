
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import api from "../services/api";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      const data = res.data;
      setCart(Array.isArray(data) ? data : data.items || []);
    } catch (err) {
      console.error("Failed to load cart:", err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeItem = async (productId) => {
    try {
      await api.delete(`/cart/${productId}`);
      await fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || "Could not remove item.");
    }
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    try {
      setCheckoutLoading(true);
      await api.post("/orders");
      alert("Order placed successfully!");
      await fetchCart();
      navigate("/orders");
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Checkout failed. Please check your login and backend order API."
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  const items = Array.isArray(cart) ? cart : [];

  const total = items.reduce((sum, item) => {
    const product = item.product || item;
    return sum + (Number(product.price) || 0) * (Number(item.quantity) || 1);
  }, 0);

  return (
    <main className="products-page">
      <button onClick={() => navigate("/products")}>
        <ArrowLeft size={18} /> Continue Shopping
      </button>

      <div className="products-header">
        <div>
          <span className="section-label">YOUR SHOPPING BAG</span>
          <h1>My Cart</h1>
          <p>{items.length} item(s) in your cart</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="empty-products">
          <ShoppingBag size={44} />
          <h2>Your cart is empty</h2>
          <p>Discover something you will love.</p>
          <Link to="/products">Explore Products</Link>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {items.map((item) => {
              const product = item.product || item;
              const productId =
                product._id ||
                item.productId?._id ||
                item.productId;

              return (
                <div className="cart-item" key={productId}>
                  <img
                    src={product.image}
                    alt={product.name || "Product"}
                    width="100"
                  />

                  <div className="cart-item-info">
                    <h3>{product.name || "Product"}</h3>
                    <p>₹{product.price}</p>
                    <p>Quantity: {item.quantity || 1}</p>
                  </div>

                  <button
                    onClick={() => removeItem(productId)}
                    disabled={!productId}
                  >
                    <Trash2 size={17} /> Remove
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <p>
              Subtotal: <strong>₹{total.toLocaleString("en-IN")}</strong>
            </p>
            <p>Shipping: <strong>Free</strong></p>
            <h2>Total: ₹{total.toLocaleString("en-IN")}</h2>

            <button
              onClick={placeOrder}
              disabled={checkoutLoading || items.length === 0}
            >
              {checkoutLoading ? "Placing Order..." : "Proceed to Checkout"}
            </button>
          </div>
        </>
      )}
    </main>
  );
}
