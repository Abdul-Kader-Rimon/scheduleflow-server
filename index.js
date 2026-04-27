const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dns = require("node:dns/promises");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

dotenv.config();
const app = express();

dns.setServers(["1.1.1.1"]);

connectDB();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("ScheduleFlow Server is running smoothly!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});