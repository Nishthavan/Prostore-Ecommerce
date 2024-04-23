import express from "express"
const router = express.Router()
import { protect, admin } from "../middleware/authMiddleware.js"
import {
  addOrderItem,
  getAllUserOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getAllOrders,
} from "../controllers/orderController.js"

router.route("/").post(protect, addOrderItem).get(protect, admin, getAllOrders)
router.route("/myorders").get(protect, getAllUserOrders)

router.route("/:id").get(protect, getOrderById)
router.route("/:id/pay").put(protect, updateOrderToPaid)
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered)

export default router
