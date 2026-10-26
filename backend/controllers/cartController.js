const User = require("../models/User");
const Product = require("../models/Product");

// Get cart
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product");

    res.json(user.cart);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get cart",
      error: error.message,
    });
  }
};

// Add product to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        message: "Not enough stock",
      });
    }

    const user = await User.findById(req.user._id);

    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      if (existingItem.quantity + Number(quantity) > product.stock) {
        return res.status(400).json({
          message: "Not enough stock",
        });
      }

      existingItem.quantity += Number(quantity);
    } else {
      user.cart.push({
        product: productId,
        quantity: Number(quantity),
      });
    }

    await user.save();

    const updatedUser = await User.findById(req.user._id).populate(
      "cart.product"
    );

    res.json(updatedUser.cart);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add product to cart",
      error: error.message,
    });
  }
};

// Update cart quantity
const updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const user = await User.findById(req.user._id);

    const item = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        message: "Product not in cart",
      });
    }

    if (quantity <= 0) {
      user.cart = user.cart.filter(
        (item) => item.product.toString() !== productId
      );
    } else {
      const product = await Product.findById(productId);

      if (!product || quantity > product.stock) {
        return res.status(400).json({
          message: "Not enough stock",
        });
      }

      item.quantity = Number(quantity);
    }

    await user.save();

    const updatedUser = await User.findById(req.user._id).populate(
      "cart.product"
    );

    res.json(updatedUser.cart);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update cart",
      error: error.message,
    });
  }
};

// Remove product from cart
const removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    await user.save();

    res.json({
      message: "Product removed from cart",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove product",
      error: error.message,
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
};