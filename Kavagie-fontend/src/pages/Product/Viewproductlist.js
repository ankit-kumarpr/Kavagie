import React, { useEffect, useState } from "react";
import "../../assests/css/comman.css";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,Grid } from "@mui/material";
import axios from "axios";
import Swal from 'sweetalert2';

const Viewproductlist = () => {
  const token = sessionStorage.getItem("Token");
  let BASE_URL1 = "http://localhost:5000/api/admin";
  const [products, setProducts] = useState([]);

  // State for the modal
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    getAllProducts();
  }, []);

  // Fetch all products
  const getAllProducts = async () => {
    try {
      const url = `${BASE_URL1}/productlist`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const response = await axios.get(url, { headers });
      console.log("All product list data:", response.data);

      setProducts(response.data.data); 
    } catch (error) {
      console.error("Error get product  connecting to API", error);
    }
  };

  // Handle delete product
  const handleDelete = async (productId) => {
    console.log("product id delete ", productId);
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    });

    if (result.isConfirmed) {
      try {
        const url = `${BASE_URL1}/delproduct/${productId}`;
        const headers = {
          "Content-Type": "multipart/form-data", 
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.delete(url,{headers});
        console.log("Product deleted successfully:", response.data);

        
        getAllProducts();

        Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
      } catch (error) {
        console.error("Error deleting product:", error);
        Swal.fire('Error!', 'There was an error deleting the product.', 'error');
      }
    } else {
      Swal.fire('Cancelled', 'Your product is safe :)', 'error');
    }
  };

  // // Handle open modal for editing
  const handleEdit = (product) => {
    setSelectedProduct(product); 
    setOpen(true); 
  };

  // Handle modal close
  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null); 
  };

  // Handle update product
  const handleUpdate = async () => {
    try {
      const url = `${BASE_URL1}/updatepro/${selectedProduct._id}`; 
      const headers = {
        "Content-Type": "multipart/form-data", 
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const { name, price, sellprice, brand, category, stock } = selectedProduct;
      const updatedProduct = { name, price, sellprice, brand, category, stock }; 

      const response = await axios.put(url, updatedProduct,{headers});
      console.log("Product updated successfully:", response.data);


      getAllProducts();
      handleClose(); 

      Swal.fire('Updated!', 'Your product has been updated.', 'success');
    } catch (error) {
      console.error("Error updating product:", error);
      Swal.fire('Error!', 'There was an error updating the product.', 'error');
    }
  };

  return (
    <div className="right-content w-100">
      <div className="row dashboardBoxWrapperRow">
        <div className="col-md-12">
          <div className="section-heading mb-4 p-4">
            <h4 className="font-weight-bold text-primary">Product List</h4>
          </div>

          <div className="form-container bg-white p-4 shadow-sm">
            <div className="table-responsive">
              <table className="table table-bordered v-align">
                <thead className="thead-dark">
                  <tr>
                    <th>Sr.No</th>
                    <th>Product Image & Name</th>
                    <th>Sell Price</th>
                    <th>Price</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((product, index) => (
                      <tr key={product._id}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={`http://localhost:5000/${product.image}`}
                              alt={product.name}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                marginRight: "10px",
                              }}
                            />
                            <span>{product.name}</span>
                          </div>
                        </td>
                        <td>{product.sellprice}</td>
                        <td>{product.price}</td>
                        <td>{product.brand}</td>
                        <td>{product.category}</td>
                        <td>{product.stock}</td>
                        <td>
                          <div className="actions d-flex align-items-center">
                            <Button
                              className="success"
                              color="success"
                              onClick={() => handleEdit(product)} // Open edit modal
                              style={{
                                backgroundColor: "rgba(26,159,83,0.2)",
                              }}
                            >
                              <FaPencilAlt />
                            </Button>
                            <Button
                              className="error"
                              color="error"
                              onClick={() => handleDelete(product._id)}
                              style={{
                                backgroundColor: "rgba(241,17,51,0.2)",
                              }}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for editing product */}
      <Dialog open={open} onClose={handleClose}>
  <DialogTitle>Edit Product</DialogTitle>
  <DialogContent>
    {selectedProduct && (
      <>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="Product Name"
              type="text"
              fullWidth
              value={selectedProduct.name}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="Price"
              type="number"
              fullWidth
              value={selectedProduct.price}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="Sell Price"
              type="number"
              fullWidth
              value={selectedProduct.sellprice}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, sellprice: e.target.value })}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="Brand"
              type="text"
              fullWidth
              value={selectedProduct.brand}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, brand: e.target.value })}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="Category"
              type="text"
              fullWidth
              value={selectedProduct.category}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="Stock"
              type="number"
              fullWidth
              value={selectedProduct.stock}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, stock: e.target.value })}
            />
          </Grid>
        </Grid>
      </>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose} variant="contained" color="error">
      Cancel
    </Button>
    <Button onClick={handleUpdate} variant="contained" color="primary">
      Update
    </Button>
  </DialogActions>
</Dialog>

    </div>
  );
};

export default Viewproductlist;
