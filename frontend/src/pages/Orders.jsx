
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, CalendarDays, ShoppingBag } from "lucide-react";
import api from "../services/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/orders")
      .then((res) => {
        const data = res.data;
        setOrders(Array.isArray(data) ? data : data.orders || []);
      })
      .catch((err) => {
        console.error("Orders loading failed:", err);
        setError(err.response?.data?.message || "Unable to load orders.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <main className="products-page"><h2>Loading orders...</h2></main>;
  }

  if (error) {
    return (
      <main className="products-page">
        <h1>My Orders</h1>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </main>
    );
  }

  return (
    <main className="products-page">
      <h1>My Orders</h1>
      <p>Track your purchases and view your order details.</p>

      {orders.length === 0 ? (
        <div className="empty-products">
          <ShoppingBag size={48} />
          <h2>No orders yet</h2>
          <p>Your purchases will appear here after checkout.</p>
          <Link to="/products">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <section className="cart-item" key={order._id}>
              <div className="order-heading">
                <Package size={24} />
                <div>
                  <h2>Order #{order._id.slice(-6).toUpperCase()}</h2>
                  <p>
                    <CalendarDays size={14} />{" "}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "Date unavailable"}
                  </p>
                </div>
                <span className="order-status">
                  {order.status || "Processing"}
                </span>
              </div>

              <div className="order-products">
                {(order.items || []).map((item, index) => {
                  const product = item.product || {};
                  const name = item.name || product.name || "Product";
                  const quantity = Number(item.quantity) || 1;
                  const price = Number(item.price ?? product.price) || 0;

                  return (
                    <div
                      className="order-product-row"
                      key={item._id || product._id || index}
                    >
                      <div>
                        <h3>{name}</h3>
                        <p>Quantity: {quantity}</p>
                      </div>
                      <strong>₹{(price * quantity).toLocaleString("en-IN")}</strong>
                    </div>
                  );
                })}
              </div>

              <div className="order-total">
                <span>Total Amount</span>
                <strong>
                  ₹{Number(order.totalAmount ?? order.total ?? 0).toLocaleString("en-IN")}
                </strong>
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
