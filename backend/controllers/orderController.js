
const Order = require("../models/Order");
const User = require("../models/User");

const createOrder = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const user = await User.findById(userId).populate("cart.product");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({
        message: "Your cart is empty",
      });
    }

    const items = user.cart.map((item) => {
      const product = item.product;

      if (!product) {
        throw new Error("A product in your cart no longer exists");
      }

      const quantity = Number(item.quantity) || 1;

      return {
        product: product._id,
        name: product.name,
        quantity,
        price: product.price,
      };
    });

    const totalAmount = items.reduce((total, item) => {
      return total + Number(item.price) * item.quantity;
    }, 0);

    const order = await Order.create({
      user: user._id,
      items,
      totalAmount,
      status: "Processing",
    });

    // Clear the cart only after the order is saved successfully.
    user.cart = [];
    await user.save();

    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Fetch orders error:", error);

    return res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
};
