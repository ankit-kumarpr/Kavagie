const Consumer = require("../../models/consumerModel");
const Dealer = require("../../models/dealerModel");
const Address = require("../../models/Address");
const Cart = require("../../models/cart.js");
const Order = require("../../models/Order.js");
const Product = require('../../models/product');
const Independetuser=require("../../models/IndependetUser.js")

const checkDiscount = async (req, res) => {
  const { userId, referralCode } = req.body;

  try {
    

    
    let user = await Consumer.findById(userId);
    let userType = 'consumer';

    if (!user) {
      user = await Dealer.findById(userId);
      userType = 'Dealer';
    }
    if (!user) {
      user = await Independetuser.findById(userId);
      userType = 'Independetuser';
    }

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }


    

    
    const discountPercentage = referralCode === user.referralCode ? user.discount : 0;

 
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ message: "No items in cart." });
    }


    let totalAmountBeforeDiscount = 0;
    for (const item of cart.items) {
      totalAmountBeforeDiscount += item.product.sellprice * item.quantity;
    }

    const discountAmount = (discountPercentage / 100) * totalAmountBeforeDiscount;
    console.log("discount money",discountAmount);
    const totalAmountAfterDiscount = totalAmountBeforeDiscount - discountAmount;

    return res.status(200).json({
      error: false,
      message: "Discount calculated successfully!",
      data: {
        totalAmountBeforeDiscount,   
        discountAmount,              
        totalAmountAfterDiscount,    
        userType
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};














const placeOrder = async (req, res) => {
  const { userId, referralCode, addressId } = req.body;

  try {
    // Try finding the user in both Consumer and Dealer collections
    let user = await Consumer.findById(userId);
    let userType = 'consumer';

    if (!user) {
      user = await Dealer.findById(userId);
      userType = 'Dealer';
    }
    if (!user) {
      user = await Independetuser.findById(userId);
      userType = 'Independetuser';
    }

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Fetch the cart and check if it contains items
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total amount for the cart
    let totalAmount = 0;
    for (const item of cart.items) {
      totalAmount += item.product.sellprice * item.quantity;
    }

    // Check for referral code discount (if provided)
    let discountPercentage = 0;
    if (referralCode && user.referralCode && referralCode === user.referralCode && user.discount) {
      discountPercentage = user.discount; // Make sure the discount field exists
    }

    const discountAmount = (discountPercentage / 100) * totalAmount;
    const totalAmountAfterDiscount = totalAmount - discountAmount;

    // Prepare order items
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.sellprice * item.quantity,
    }));

    // Place the order
    const order = new Order({
      user: user._id,
      userType,
      items: orderItems,
      totalAmount: totalAmountAfterDiscount,
      discountApplied: discountAmount,
      referralCode: referralCode || null,
      status: 'Pending'
    });

    await order.save();

    // Clear the cart after the order is placed
    cart.items = [];
    await cart.save();

    // Respond with the order details
    return res.status(201).json({
      error: false,
      message: "Order placed successfully!",
      data: {
        order: {
          _id: order._id,
          items: order.items,
          totalAmount: order.totalAmount,
          discountApplied: order.discountApplied,
          referralCode: order.referralCode,
          status: order.status,
        },
        userType,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          referralCode: user.referralCode || 'N/A', // Make sure referralCode exists
          discount: user.discount || 0, // Handle missing discount field
        },
      },
    });
  } catch (error) {
    console.error('Error placing order:', error.message, error.stack);
    return res.status(500).json({ error: true, message: "Internal server error" });
  }
};













const getOrderHistory = async (req, res) => {
  const { id } = req.params;

  try {
    // Try finding the user in both the Consumer and Dealer collections
    let user = await Consumer.findById(id);
    let userType = 'consumer';

    if (!user) {
      user = await Dealer.findById(id);
      userType = 'Dealer';
    }
    if (!user) {
      user = await Independetuser.findById(id);
      userType = 'Independetuser';
    }

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Query for orders associated with the user
    const orders = await Order.find({ user: id })
      .populate("items.product")
      .sort({ orderDate: -1 });

    // Returning both the user data and the associated orders
    return res.status(200).json({
      error: false,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role:user.role,
        referralCode: user.referralCode,
        discount: user.discount,
      },
      orders,
      userType,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};






module.exports = {
  placeOrder,
  getOrderHistory,
  checkDiscount
};
