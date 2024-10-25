const express = require("express");
const {
  getAllDealersWithConsumers,
  getAllConsumersWithDealers,
  Getsingledealer,
  Deldealer,
  Updatedealer,
  Getconsumerdealer,
  Delconsumer,
  Updateconsumer,
  AddProduct, 
  
  upload,
  Getproducts,
  Delproduct,
  Updateproduct,
  Getallconsumer,
  Dealerorder,
  Consumerorder,
  Getallusers,
  Deluser
} = require("../controllers/adminController");

const {createCategory,getAllCategories,Deletecategory}=require('../controllers/products/category_controller');


const { protect, adminOnly } = require("../middlewares/authMiddleware");








const router = express.Router();

// Admin routes
router.get("/dealers", protect, adminOnly, getAllDealersWithConsumers);
router.get("/consumers", protect, adminOnly, getAllConsumersWithDealers);
router.get("/singledealer/:id", protect, adminOnly, Getsingledealer);
router.delete("/deldealer/:id", protect, adminOnly, Deldealer);
router.put("/updatedealer/:id",protect, adminOnly,Updatedealer);
router.get("/getconsumerusedealer/:dealerId",protect,adminOnly,Getconsumerdealer);
router.put("/updateconsumer/:id",protect, adminOnly,Updateconsumer);
router.delete("/deleteconsumer/:id" ,protect, adminOnly,Delconsumer)
router.post('/addproduct', protect, adminOnly, upload.single('image'), AddProduct);


// -------------------------products route------------------------
router.post('/addcategory',protect, adminOnly,createCategory);
router.get('/getcategory',getAllCategories);
router.delete('/delcategory/:id',protect, adminOnly,Deletecategory);

// ---------------------------------------consumer routes---------------------

router.get('/allconsumers',protect, adminOnly,Getallconsumer);
// ---------------------------------------

router.post('/addproduct', protect, adminOnly, upload.single('image'), AddProduct);
router.get("/productlist",Getproducts);
router.delete("/delproduct/:id",protect,adminOnly,Delproduct);
router.put("/updatepro/:id",protect,adminOnly,Updateproduct);

router.get("/dealerorder/:id",Dealerorder);
router.get("/consumerorders/:id",Consumerorder);

router.get("/allusers",Getallusers);
router.delete("/deluser/:id",Deluser);


module.exports = router;
