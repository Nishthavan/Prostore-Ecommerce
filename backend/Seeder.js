// THIS FILE IS JUST USED TO FILL MONGODB WITH DATA OR DELETE DATA
import mongoose from "mongoose"
import colors from "colors"
import dotenv from "dotenv"
import ConnectDB from "./DatabaseConfig/dbconfig.js"
import users from "./Data/users.js"
import products from "./Data/products.js"
import User from "./models/userModel.js"
import Order from "./models/orderModel.js"
import Product from "./models/productModel.js"

// dotenv.config()
// ConnectDB()

const importData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()

    const Allusers = await User.insertMany(users)
    const AdminUserID = Allusers[0]._id

    const Allproducts = products.map((p) => {
      return { ...p, user: AdminUserID }
    })
    await Product.insertMany(Allproducts)
    console.log("Data Successfully Added".green.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error.message}`.red.inverse)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()
    console.log("Data Successfully Deleted".green.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error.message}`.red.inverse)
    process.exit(1)
  }
}

// if (process.argv[2] === "-d") {
//   destroyData()
// } else {
//   importData()
// }
// console.log(
//   "Mate Are you sure if yes then Make changes in Seeder.js".red.inverse
// )
