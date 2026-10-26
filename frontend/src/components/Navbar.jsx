
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, Package, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">ShopNest</Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>

        {user ? (
          <>
            <Link to="/wishlist"><Heart size={17} /> Wishlist</Link>
            <Link to="/cart"><ShoppingBag size={17} /> Cart</Link>
            <Link to="/orders"><Package size={17} /> Orders</Link>
            <button onClick={handleLogout}>
              <LogOut size={17} /> Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
