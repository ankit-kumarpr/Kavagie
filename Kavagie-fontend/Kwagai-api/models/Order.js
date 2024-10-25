const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'userType',
    required: true,
  },
  userType: {
    type: String,
    enum: ["consumer", "Dealer","Independetuser"], 
    required: true,
  },
  items: [orderItemSchema], 
  totalAmount: {
    type: Number,
    required: true,
  },
  discountApplied: {
    type: Number,
    default: 0,
  },
  referralCode: {
    type: String, 
    default: null,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Completed", "Cancelled"], 
  },
});

module.exports = mongoose.model("Order", orderSchema);
