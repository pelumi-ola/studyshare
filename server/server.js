import { config } from "dotenv";

config();

import app from "./app.js";
import connectDB from "./config/database.js";

const PORT = process.env.PORT;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
