require("./Database/server");
// require("dotenv").config();
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/images', express.static('images'));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/dealer", require("./routes/dealerRoutes"));

app.use("/api/shop",require("./routes/allroutes"));

app.use("/api/blog", require("./routes/blogRoutes"));

app.use("/api/user", require("./routes/Independetuserroutes"));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("Server running on port no= ", port);
});
