import React, { useEffect, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { MdDeleteForever } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { FaPencilAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import './product.css'

const Viewcart = () => {
  const token = sessionStorage.getItem("Token");
  const BASE_url = "http://localhost:5000";
  const [UserID, setUserID] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [totalamount, setTotalamount] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [refral,setRefral]=useState("");
  const [discount,setdiscount]=useState("");
  const [finalamount,setFinalamount]=useState("");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUserID(decoded.id);
    }
  }, [token]);

  useEffect(() => {
    GetAdress();
  }, []);
  useEffect(() => {
    if (UserID) {
      Getcart();
      GetAdress();
    }
  }, [UserID]);

  const Getcart = async () => {
    try {
      const url = `${BASE_url}/api/shop/getcart/${UserID}`;
      const response = await axios.get(url);
      console.log("response of get api", response);

      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data.items)
      ) {
        setCartItems(response.data.data.items);
        setTotalamount(response.data.data);
      } else {
        console.error("No items found or items is not an array", response.data);
        setCartItems([]);
      }
    } catch (error) {
      console.log("error in get api", error);
    }
  };

  const updateCartQuantity = async (productId, quantity) => {
    try {
      const url = `${BASE_url}/api/shop/updatecart`;

      const requestBody = {
        userId: UserID,
        productId: productId,
        quantity: quantity,
      };

      const response = await axios.put(url, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Cart updated:", response.data);
      Getcart();
    } catch (error) {
      console.error("Error updating cart quantity", error);
      toast.error("Failed to update cart quantity");
    }
  };

  const Delcart = async (productId) => {
    try {
      const url = `${BASE_url}/api/shop/removecart`;
      const requestBody = {
        userId: UserID,
        productId: productId,
      };

      const response = await axios.post(url, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Cart item removed:", response.data);
      toast.info("Item removed from cart");
      Getcart();
    } catch (error) {
      console.error("Error removing cart item", error);
      toast.error("Failed to remove item from cart");
    }
  };

  const handleIncreaseQuantity = (item) => {
    updateCartQuantity(item.product._id, item.quantity + 1);
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) {
      updateCartQuantity(item.product._id, item.quantity - 1);
    } else {
      Delcart(item.product._id);
    }
  };

  // Handle opening the modal
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  // Handle address submission
  const handleAddressSubmit = (e) => {
    e.preventDefault();

    Adddeliveryadress();
    handleCloseModal();
  };

  // -----------------------------------add address api-------------------
  const Adddeliveryadress = async () => {
    try {
      const url = `${BASE_url}/api/shop/deliveryaddress`;

      const requestBody = {
        consumerId: UserID,
        street: street,
        city: city,
        state: state,
        zipCode: zip,
        country: country,
        phone: phone,
      };

      const response = await axios.post(url, requestBody);
      console.log("response of address api", response);
    } catch (error) {
      console.log("Add address api ", error);
    }
  };

  // ------------------------------------------end----------------------
  const GetAdress = async () => {
    try {
      const url = `${BASE_url}/api/shop/alladdress/${UserID}`;

      const response = await axios.get(url);
      console.log("Response of get address", response);
      setAddresses(response.data.data);
    } catch (error) {
      console.log("Error in get address api", error);
    }
  };

  //  ------------------------------------end----------------------------------

  const Deladdress = async (addressId) => {
    try {
      console.log("Address ID is", addressId);
      const { isConfirmed } = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      // Proceed only if confirmed
      if (isConfirmed) {
        const url = `${BASE_url}/api/shop/deladdress/${addressId}`;
        const response = await axios.delete(url);
        console.log("Response of delete API", response);

        // Call function to fetch updated addresses
        await GetAdress(); // Ensure this updates the state

        // Show success message
        await Swal.fire(
          "Deleted!",
          "Your address has been deleted.",
          "success"
        );
      }
    } catch (error) {
      console.log("Error in delete API", error);
      // Show error message
      Swal.fire(
        "Error!",
        "There was a problem deleting your address.",
        "error"
      );
    }
  };

  // ----------------------------------apply coupon code-------------


  const Addcoupancode=async()=>{
    try{

      const url=`${BASE_url}/api/shop/checkdiscount`;

      const requestBody={
        userId: UserID,
        referralCode: refral,
        addressId: selectedAddressId
      }

      
      const response=await axios.post(url,requestBody);
      console.log("Response of apply coupon ",response);
      const maindata=response.data.data;
      console.log("maindata",maindata);
      setdiscount(maindata.discountAmount);
      setFinalamount(maindata.totalAmountAfterDiscount);

    }catch(error){
      console.log("Error in add coupon code ",error);
    }
  }

  // -------------------------------------------order api------------------------
  const Doneorder = async () => {
    try {
      const url = `${BASE_url}/api/shop/doneorder`;

      const requestBody = {
        userId: UserID,
        referralCode: refral,
        addressId: selectedAddressId, 
      };

      const response = await axios.post(url, requestBody);
      console.log("Done order response", response);
      Getcart();
      if(response.data.message==="Order placed successfully!"){
        Swal.fire({
          title: "Good job!",
          text: "Your Order done successfully..",
          icon: "success"
        });
        Getcart();
      }
      // toast.success("Order placed successfully!"); 

    } catch (error) {
      console.log("Error in order done api", error);
      toast.error("Failed to place order"); 
    }
  };

  // ----------------------------------

  // -------------------------------------------end----------------------------
  return (
    <div className="right-content w-100">
      <div className="row dashboardBoxWrapperRow">
        <div className="col-md-12">
          <div className="section-heading mb-4 p-4">
            <h4 className="font-weight-bold text-primary">View Cart</h4>
          </div>

          <div className="form-container bg-white p-4 shadow-sm">
            <div className="row d-flex justify-content-between">
              {/* Left Section */}
              <div className="col-lg-5">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>

                      <th>Quantity</th>
                      <th>Price</th>
                      {/* <th>Remove Cart</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.length > 0 ? (
                      cartItems.map((item) => (
                        <tr key={item.product._id}>
                          <td>
                            <div className="d-flex">
                              <img
                                src={`http://localhost:5000/${item.product.image}`}
                                alt={item.product.name}
                                className="img-fluid"
                                style={{
                                  width: "80px",
                                  height: "80px",
                                  objectFit: "cover",
                                  marginRight: "15px",
                                }}
                              />
                              <div>
                                <p className="mb-1">{item.product.name}</p>
                                <br />
                                <span
                                  style={{ color: "red" }}
                                  onClick={() => Delcart(item.product._id)}
                                >
                                  <MdDeleteForever size={24} />
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="input-group">
                              <button
                                className="btn btn-outline-secondary"
                                onClick={() => handleDecreaseQuantity(item)}
                              >
                                <FaMinus />
                              </button>
                              <input
                                type="text"
                                className="form-control text-center"
                                value={item.quantity}
                                readOnly
                                style={{ maxWidth: "50px" }}
                              />
                              <button
                                className="btn btn-outline-secondary"
                                onClick={() => handleIncreaseQuantity(item)}
                              >
                                <FaPlus />
                              </button>
                            </div>
                          </td>
                          <td>{item.price.toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          Your cart is empty.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="col-lg-3">
  {/* Address List Section */}
  <h5 className="mb-3">Saved Addresses</h5>
  <ul className="list-group">
    {addresses.length > 0 ? (
      addresses.map((address) => (
        <li
          key={address._id}
          className={`list-group-item ${
            selectedAddressId === address._id ? "selected-address" : ""
          }`} // Add class for selected address
          style={{ marginBottom: "15px", cursor: "pointer" }} // Add consistent gap between addresses
          onClick={() => setSelectedAddressId(address._id)} // Set selected address on click
        >
          <div>
            <strong>{address.recipientName}</strong>
            <p>
              {address.street}, {address.city}, {address.state}, {address.zipCode}, {address.country}
            </p>
            <p>{address.phone}</p>
          </div>
          <span
            style={{ color: "red", cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent selecting the address when clicking delete
              Deladdress(address._id);
            }} // Handle address deletion
          >
            <MdDeleteForever size={20} />
          </span>
          {/* <span
            style={{
              color: "green",
              marginLeft: "20px",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation(); 
            }}
          >
            <FaPencilAlt size={20} />
          </span> */}
        </li>
      ))
    ) : (
      <li className="list-group-item text-center">
        No addresses saved.
      </li>
    )}
  </ul>
</div>



              {/* Right Section */}
              <div className="col-lg-4">
                <div className="card shadow-sm p-4">
                  <div className="mb-3">
                    <Button variant="contained" onClick={handleOpenModal}>
                      Add Address
                    </Button>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="coupon" className="form-label">
                      Coupon Code
                    </label>
                    <input
                      type="text"
                      id="coupon"
                      className="form-control"
                      placeholder="Enter Coupon Code"
                      onChange={(e)=>setRefral(e.target.value)}
                    />
                    <button className="btn btn-dark w-100 mt-2" onClick={Addcoupancode}>Apply</button>
                  </div>

                  <div className="card bg-light p-3">
                    <h5 className="font-weight-bold">Cart Total</h5>
                    <div className="d-flex justify-content-between">
                      <p>Cart Subtotal</p>
                      <p>Rs. {totalamount.totalAmount}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p>Shipping</p>
                      <p>Free</p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p>Discount</p>
                      <p>Rs. {discount}</p>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between font-weight-bold">
                      <p>Grand Total</p>
                      <p>Rs. {finalamount}</p>
                    </div>
                    <button
                      className="btn btn-primary w-100"
                      onClick={Doneorder} // Trigger Doneorder function
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Add Address */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <div
          style={{
            padding: "20px",
            maxWidth: "500px",
            margin: "auto",
            marginTop: "100px",
            backgroundColor: "white",
            borderRadius: "8px",
          }}
        >
          <h2>Add Address</h2>
          <form onSubmit={handleAddressSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Street Address"
                  variant="outlined"
                  name="street"
                  onChange={(e) => setStreet(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  variant="outlined"
                  name="city"
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  variant="outlined"
                  name="state"
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Pin Code"
                  variant="outlined"
                  name="postalCode"
                  onChange={(e) => setZip(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                < TextField
                  fullWidth
                  label="Country"
                  variant="outlined"
                  name="Country"
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone No"
                  variant="outlined"
                  name="Phone No."
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </Grid>
            </Grid>
            <div className="mt-3">
              <Button variant="contained" color="primary" type="submit">
                Submit Address
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCloseModal}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default Viewcart;