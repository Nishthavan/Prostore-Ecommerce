import express from "express"
const router = express.Router()
import {
  getProductById,
  getProducts,
  deleteProductById,
  updateProduct,
  createProduct,
  createReview,
  getTopProducts,
} from "../controllers/productController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

router.route("/").get(getProducts).post(protect, admin, createProduct)
router.route("/top").get(getTopProducts)
router
  .route("/:id")
  .get(getProductById)
  .delete(protect, admin, deleteProductById)
  .put(protect, admin, updateProduct)
router.route("/:id/reviews").post(protect, createReview)

export default router
