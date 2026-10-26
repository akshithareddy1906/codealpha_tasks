const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
} = require("../controllers/cartController");

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.put("/", protect, updateCart);
router.delete("/:productId", protect, removeFromCart);

module.exports = router;