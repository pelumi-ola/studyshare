import { connect } from "mongoose";
const connectDB = async () => {
  try {
    const connection = await connect(process.env.MONGODB_URI, {
      dbName: "studyshare",
    });
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};
export default connectDB;
