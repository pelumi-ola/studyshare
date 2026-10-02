import { config } from "dotenv";

config();

import { listen } from "./app";
import connectDB from "./config/database";

const PORT = process.env.PORT;

connectDB();

listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
