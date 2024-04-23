import asyncHandler from "express-async-handler"
import Order from "../models/orderModel.js"

// @ROUTE - /api/orders + "whatever"

// @Desc - createNewOrder
// @Extended Route - /  POST PRIVATE
const addOrderItem = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    taxPrice,
    shippingPrice,
    totalPrice,
    itemsPrice,
    paymentMethod,
  } = req.body
  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error("No Items to Order")
    return
  } else {
    const order = new Order({
      orderItems,
      shippingAddress,
      taxPrice,
      shippingPrice,
      totalPrice,
      itemsPrice,
      paymentMethod,
      user: req.user._id,
    })
    const createdOrder = await order.save()
    res.status(201).json(createdOrder)
  }
})

// @Desc - getOrderById
// @Extended Route - /:id  GET PRIVATE
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  )
  if (order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error("Order Not Found")
  }
})

// @Desc - updateOrderToPaid
// @Extended Route - /:id/pay  PUT PRIVATE
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (order && req.body.status == "COMPLETED") {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    }
    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error("Order Not Found")
  }
})

// @Desc - updateOrderToDelivered
// @Extended Route - /:id/deliver  PUT PRIVATE/ADMIN
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()
    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error("Order Not Found")
  }
})

// @Desc - Get All user orders
// @Extended Route - /myorders  GET PRIVATE
const getAllUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
  res.json(orders)
})

// @Desc - Get All orders
// @Extended Route - /  GET PRIVATE/ADMIN
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name")
  res.json(orders)
})

export {
  addOrderItem,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getAllUserOrders,
  getAllOrders,
}
