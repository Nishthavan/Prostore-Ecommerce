import asyncHandler from "express-async-handler"
import Product from "../models/productModel.js"

// @ROUTE - /api/products + "whatever"

// @Desc - Fetch all products
// @Extended Route - /  PUBLIC
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8
  const page = Number(req.query.pageNumber) || 1
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {}
  const count = await Product.countDocuments({ ...keyword })
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

// @Desc - Fetch Product By ID GET
// @Extended Route - /:id PUBLIC
const getProductById = asyncHandler(async (req, res) => {
  const id = req.params.id
  const product = await Product.findById(id)
  if (product) {
    res.json(product)
  } else {
    // Because we have created middleware to handle error now
    res.status(404)
    throw new Error("Product not found")
  }
})

// @Desc - Delete Product By id DELETE
// @Extended Route - /:id PRIVATE/ADMIN
const deleteProductById = asyncHandler(async (req, res) => {
  const id = req.params.id
  const product = await Product.findById(id)
  if (product) {
    await product.remove()
    res.json({ message: "Product Removed" })
  } else {
    res.status(404)
    throw new Error("Product not found")
  }
})

// @Desc - Create Product POST
// @Extended Route - / PRIVATE/ADMIN
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample",
    category: "Sample",
    countInStock: 0,
    numReviews: 0,
    description: "Sample Desc",
  })
  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

// @Desc - Update Product PUT
// @Extended Route - /:id PRIVATE/ADMIN
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    product.name = req.body.name || product.name
    product.price = req.body.price || product.price
    product.image = req.body.image || product.image
    product.brand = req.body.brand || product.brand
    product.category = req.body.category || product.category
    product.description = req.body.description || product.description
    product.countInStock = req.body.countInStock || product.countInStock

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error("Product Not Found")
  }
})

// @Desc - Create Review (POST)
// @Extended Route - /:id/review  PRIVATE
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body
  const product = await Product.findById(req.params.id)
  if (product) {
    const isAlreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    if (isAlreadyReviewed) {
      res.status(400)
      throw new Error("Already Reviewed")
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    product.reviews.push(review)
    product.numReviews = product.reviews.length
    product.rating =
      product.reviews.reduce((acc, item) => acc + item.rating, 0) /
      product.reviews.length

    await product.save()
    res.status(201).json({ message: "Review Saved" })
  } else {
    res.status(404)
    throw new Error("Product Not Found")
  }
})

// @Desc - GET TOP RATED PRODUCTS (GET)
// @Extended Route - /top PUBLIC
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(5)
  res.json(products)
})

export {
  getProductById,
  getProducts,
  deleteProductById,
  createProduct,
  updateProduct,
  createReview,
  getTopProducts,
}
