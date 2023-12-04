const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();
const path = require("path")


const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json())

const mongodburl = process.env.MONGO_DB_URL

app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(mongodburl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a schema for the user data
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model("User", userSchema);


//schema for orders
const orderItemsSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    houseadd: String,
    apartment: String,
    city: String,
    state: String,
    pin: String,
    phone: String,
    email: String,
  });
  
const OrderItems = mongoose.model('OrderItems', orderItemsSchema);



// Middleware for parsing JSON data
app.use(bodyParser.json());

// Login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });
    if (user) {
      res.json({ success: true, message: "Login successful" });
      console.log(email, password);
    } else {
      const newUser = new User({ email, password });
      await newUser.save();
      res.status(401).json({ success: false, message: "Invalid credentials" });
      console.log(email, password);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Order items endpoint
app.post("/orderitems", async (req, res) => {
    const orderData = req.body;
  
    try {
      // Create a new order item
      const orderItem = new OrderItems(orderData);
      await orderItem.save();
  
      res.json({ success: true, message: "Order items received" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });
  

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
