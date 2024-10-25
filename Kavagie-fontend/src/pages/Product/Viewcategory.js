import React, { useEffect, useState } from "react";
import "../../assests/css/comman.css";
import { Button } from "@mui/material";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

const Viewcategory = () => {
  const [categorys, setCategory] = useState([]);
  const [error, setError] = useState(null);

  const token = sessionStorage.getItem("Token");
  const BASE_url = "http://localhost:5000";

  useEffect(() => {
    getCategoryList();
  }, []);

  // Fetch category list from the API
  const getCategoryList = async () => {
    try {
      const url = `${BASE_url}/api/admin/getcategory`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.get(url, { headers });
      console.log("category list", response);
      const categoryData = response.data.data;
      setCategory(categoryData); // Set the category data
    } catch (error) {
      console.log("Error fetching category list: ", error);
      setError("Failed to fetch categories.");
    }
  };

  // Delete category by ID
  const deleteCategory = async (id) => {
    try {
      const url = `${BASE_url}/api/admin/delcategory/${id}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`, 
      };

      const response = await axios.delete(url, { headers });
      console.log("Delete response", response);

      if (response.status === 200) {
      
        setCategory((prevCategories) =>
          prevCategories.filter((category) => category._id !== id)
        );
        Swal.fire("Deleted!", "Category has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      Swal.fire("Error!", "Failed to delete the category.", "error");
    }
  };

 
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
       
        deleteCategory(id);
      }
    });
  };

  return (
    <div className="right-content w-100">
      <div className="row dashboardBoxWrapperRow">
        <div className="col-md-12">
          <div className="section-heading mb-4 p-4">
            <h4 className="font-weight-bold text-primary">Total Added Category List</h4>
          </div>

          <div className="form-container bg-white p-4 shadow-sm">
            <div className="table-responsive">
              <table className="table table-bordered v-align">
                <thead className="thead-dark">
                  <tr>
                    <th>Sr.No</th>
                    <th>Category Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categorys && categorys.length > 0 ? (
                    categorys.map((category, index) => (
                      <tr key={category._id}>
                        <td>{index + 1}</td>
                        <td>{category.name}</td>
                        <td>
                          <div className="actions d-flex align-items-center">
                            <Button
                              className="error"
                              color="error"
                              style={{
                                backgroundColor: "rgba(241,17,51,0.2)",
                              }}
                              onClick={() => handleDelete(category._id)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">
                        No categories found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Error message */}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default Viewcategory;
