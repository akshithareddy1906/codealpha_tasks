
import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminOrders.css";

const API = "http://localhost:5000/api/orders";
const statuses = ["Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState("");

  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      setError("");
      const res = await axios.get(`${API}/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setUpdating(id);
      await axios.patch(
        `${API}/admin/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update status.");
    } finally {
      setUpdating("");
    }
  };

  if (loading) return <p className="admin-message">Loading orders...</p>;

  return (
    <main className="admin-orders">
      <h1>Admin Dashboard</h1>
      <p className="admin-subtitle">Manage customer orders and delivery status.</p>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-summary">
        <div><span>Total Orders</span><strong>{orders.length}</strong></div>
        <div><span>Processing</span><strong>{orders.filter(o => o.status === "Processing").length}</strong></div>
        <div><span>Shipped</span><strong>{orders.filter(o => o.status === "Shipped").length}</strong></div>
        <div><span>Delivered</span><strong>{orders.filter(o => o.status === "Delivered").length}</strong></div>
      </div>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="admin-order-list">
          {orders.map(order => (
            <article className="admin-order-card" key={order._id}>
              <div className="admin-order-top">
                <div>
                  <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                  <small>{new Date(order.createdAt).toLocaleDateString()}</small>
                </div>
                <strong>₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}</strong>
              </div>

              <div className="admin-order-items">
                {(order.items || []).map((item, index) => (
                  <p key={item._id || index}>
                    {item.name || item.product?.name || "Product"} × {item.quantity}
                    {" — "}₹{Number(item.price || 0).toLocaleString("en-IN")}
                  </p>
                ))}
              </div>

              <label className="admin-status-label">
                Update status
                <select
                  value={order.status}
                  disabled={updating === order._id}
                  onChange={e => updateStatus(order._id, e.target.value)}
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </label>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
