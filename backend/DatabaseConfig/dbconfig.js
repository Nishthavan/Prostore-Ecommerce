import mongoose from "mongoose"

const ConnectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useCreateIndex: true,
      useNewUrlParser: true,
    })
    console.log(`MongoDB Connected : ${connect.connection.host}`.blue.inverse)
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold)
    process.exit(1)
  }
}

export default ConnectDB
