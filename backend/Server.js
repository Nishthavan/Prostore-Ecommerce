import path from "path"
import express from "express"
import dotenv from "dotenv"
import morgan from "morgan"
import ConnectDB from "./DatabaseConfig/dbconfig.js"
import colors from "colors"
import productRoutes from "./routes/productRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"

// Configurations
dotenv.config()
ConnectDB()
const app = express()
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}
app.use(express.json())

//Routing using Router
app.use("/api/products", productRoutes)
app.use("/api/users", userRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/upload", uploadRoutes)
app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENTID)
)

const __dirname = path.resolve()
app.use("/uploads", express.static(path.join(__dirname, "/uploads")))
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")))
  // Run NPM RUN BUILD before setting NODE_ENV to Production
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  )
}

// 404 Status error
app.use(notFound)
// Customized Error Handler
app.use(errorHandler)

// Listening
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(
    `Server Running ${process.env.NODE_ENV} mode on PORT ${PORT}`.blue.inverse
  )
})
