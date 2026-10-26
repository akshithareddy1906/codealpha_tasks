
const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
} = require("../controllers/orderController");

const {
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/adminOrderController");

const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// Customer routes
router.post("/", protect, createOrder);
router.get("/", protect, getMyOrders);

// Admin routes
router.get("/admin/all", protect, admin, getAllOrders);
router.patch("/admin/:id/status", protect, admin, updateOrderStatus);

module.exports = router;
