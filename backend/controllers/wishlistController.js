const User = require("../models/User");

// Get wishlist
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");

    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get wishlist",
      error: error.message,
    });
  }
};

// Add/remove wishlist item
const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const user = await User.findById(req.user._id);

    const exists = user.wishlist.some(
      (id) => id.toString() === productId
    );

    if (exists) {
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== productId
      );
    } else {
      user.wishlist.push(productId);
    }

    await user.save();

    const updatedUser = await User.findById(req.user._id).populate(
      "wishlist"
    );

    res.json(updatedUser.wishlist);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update wishlist",
      error: error.message,
    });
  }
};

module.exports = {
  getWishlist,
  toggleWishlist,
};