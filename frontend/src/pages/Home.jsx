import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">
            ✨ New Collection
          </span>

          <h1>
            Everything You Need,
            <br />
            All in One Place.
          </h1>

          <p>
            Discover quality products at amazing prices.
            Shop smarter, faster and easier.
          </p>

          <div className="hero-buttons">
            <Link to="/products" className="primary-btn">
              Shop Now
            </Link>

            <Link to="/products" className="secondary-btn">
              Explore Products
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div>
          <h3>🚚 Fast Delivery</h3>
          <p>Quick and reliable delivery.</p>
        </div>

        <div>
          <h3>🔒 Secure Payment</h3>
          <p>Your information stays protected.</p>
        </div>

        <div>
          <h3>↩️ Easy Returns</h3>
          <p>Simple and hassle-free returns.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;