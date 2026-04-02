import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
