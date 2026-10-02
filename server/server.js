import { config } from "dotenv";

config();

import { listen } from "./app.js";
import connectDB from "./config/database.js";

const PORT = process.env.PORT;

connectDB();

listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
