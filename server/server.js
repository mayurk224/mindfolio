import dotenv from "dotenv";

dotenv.config();

const { default: app } = await import("./src/app.js");
const { default: connectDB } = await import("./config/db.js");

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
