import React, { useEffect, useState } from "react";
import "../../assests/css/comman.css";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { Button, Modal, Box, TextField } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ViewClient = () => {
  const [dealers, setDealers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [updatedDealer, setUpdatedDealer] = useState({
    name: "",
    email: "",
    referralCode: "",
    discount: "",
  });

  const token = sessionStorage.getItem("Token");
  const navigate = useNavigate();
  const BASE_url = "http://localhost:5000";

  useEffect(() => {
    Getdealerlist();
  }, []);

  const Getdealerlist = async () => {
    try {
      const url = `${BASE_url}/api/admin/dealers`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers });
      const dealerData = response.data.data[0];
      setDealers(dealerData); // Set the dealers data
    } catch (error) {
      console.log("Error fetching dealers list: ", error);
    }
  };

  // Function to handle open modal
  const handleOpen = (dealer) => {
    setSelectedDealer(dealer);
    setUpdatedDealer({
      name: dealer.name,
      email: dealer.email,
      referralCode: dealer.referralCode || "",
      discount: dealer.discount || "",
    });
    setOpen(true);
  };

  // Function to handle close modal
  const handleClose = () => {
    setOpen(false);
    setSelectedDealer(null);
  };

  // Function to handle updating dealer
  const handleUpdateDealer = async () => {
    try {
      const url = `${BASE_url}/api/admin/updatedealer/${selectedDealer._id}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.put(url, updatedDealer, { headers });
      if (response.status === 200) {
        Swal.fire("Success", "Dealer updated successfully", "success");
        handleClose();
        Getdealerlist(); // Refresh the list
      }
    } catch (error) {
      console.log("Error updating dealer: ", error);
      Swal.fire("Error", "Failed to update dealer", "error");
    }
  };

  // Function to handle change in form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDealer({ ...updatedDealer, [name]: value });
  };

  // Function to handle delete dealer
  const handleDeleteDealer = async (dealerId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const url = `${BASE_url}/api/admin/deldealer/${dealerId}`;
          const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          };

          const response = await axios.delete(url, { headers });
          if (response.status === 200) {
            Swal.fire("Deleted!", "Dealer has been deleted.", "success");
            Getdealerlist(); // Refresh the list after deletion
          }
        } catch (error) {
          console.log("Error deleting dealer: ", error);
          Swal.fire("Error", "Failed to delete dealer", "error");
        }
      }
    });
  };

  return (
    <div className="right-content w-100">
      <div className="row dashboardBoxWrapperRow">
        <div className="col-md-12">
          <div className="section-heading mb-4 p-4">
            <h4 className="font-weight-bold text-primary">Total Dealer List</h4>
          </div>

          <div className="form-container bg-white p-4 shadow-sm">
            <div className="table-responsive">
              <table className="table table-bordered v-align">
                <thead className="thead-dark">
                  <tr>
                    <th>Sr.No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Referral Code</th>
                    <th>Discount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dealers && dealers.length > 0 ? (
                    dealers.map((dealer, index) => (
                      <tr key={dealer._id}>
                        <td>{index + 1}</td>
                        <td>{dealer.name}</td>
                        <td>{dealer.email}</td>
                        <td>{dealer.referralCode || "N/A"}</td>
                        <td>{dealer.discount || "N/A"}</td>
                        <td>
                          <div className="actions d-flex align-items-center">
                            <Button
                              className="success"
                              color="success"
                              style={{
                                backgroundColor: "rgba(26,159,83,0.2)",
                              }}
                              onClick={() => handleOpen(dealer)}
                            >
                              <FaPencilAlt />
                            </Button>
                            <Button
                              className="error"
                              color="error"
                              style={{
                                backgroundColor: "rgba(241,17,51,0.2)",
                              }}
                              onClick={() => handleDeleteDealer(dealer._id)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No dealers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Update Dealer Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h4 className="text-center">Update Dealer</h4>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="name"
            value={updatedDealer.name}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={updatedDealer.email}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Referral Code"
            name="referralCode"
            value={updatedDealer.referralCode}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Discount"
            name="discount"
            value={updatedDealer.discount}
            onChange={handleInputChange}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateDealer}
            fullWidth
          >
            Update Dealer
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default ViewClient;
