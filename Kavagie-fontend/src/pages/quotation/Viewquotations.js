import React, { useEffect, useState } from "react";
import "../../assests/css/comman.css";
import { Button } from "@mui/material";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

const ViewAllQuotation = () => {
  const [consumers, setConsumers] = useState([]);
  const [error, setError] = useState(null);

  const token = sessionStorage.getItem("Token");
  const BASE_url = "http://localhost:5000";

  useEffect(() => {
    getConsumerList();
  }, []);

  // Fetch consumers from the API
  const getConsumerList = async () => {
    try {
      const url = `${BASE_url}/api/admin/allconsumers`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers });
      console.log("consumer list",response);
      const consumerData = response.data.data;
      setConsumers(consumerData); // Set the consumers data
    } catch (error) {
      console.log("Error fetching consumers list: ", error);
      setError("Failed to fetch consumers.");
    }
  };

  return (
    <div className="right-content w-100">
      <div className="row dashboardBoxWrapperRow">
        <div className="col-md-12">
          <div className="section-heading mb-4 p-4">
            <h4 className="font-weight-bold text-primary">Total Consumer List</h4>
          </div>

          <div className="form-container bg-white p-4 shadow-sm">
            <div className="table-responsive">
              <table className="table table-bordered v-align">
                <thead className="thead-dark">
                  <tr>
                    <th>Sr.No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Refral Code</th>
                    <th>Discount</th>
                    {/* <th>Action</th> */}
                  </tr>
                </thead>
                <tbody>
                  {consumers && consumers.length > 0 ? (
                    consumers.map((consumer, index) => (
                      <tr key={consumer._id}>
                        <td>{index + 1}</td>
                        <td>{consumer.name}</td>
                        <td>{consumer.email}</td>
                        <td>{consumer.referralCode}</td>
                        <td>{consumer.discount}</td>
                        
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No consumers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="alert alert-danger mt-3">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAllQuotation;
