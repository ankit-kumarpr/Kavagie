import "./App.css";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from "./pages/Home/Dashboard";
import Header from "./components/Header/header";
import Sidebar from "./components/SideBar/SideBar"; // Import only the dynamic Sidebar
import AddClient from "./pages/clients/AddClient";
import ViewClient from "./pages/clients/ViewClient";
import AddProduct from "./pages/Product/AddProduct.js";
import Viewquotations from "./pages/quotation/Viewquotations";
import Createbill from "./pages/Billing/Createbill";
import Selectproduct from "./pages/Billing/Selectproduct";
import Reviewbillpro from "./pages/Billing/reviewbillpro.js";
import Genratebill from "./pages/Billing/GenrateBill.js";
import Viewbilllist from "./pages/Billing/Viewbilllist.js";
import Viewproductlist from "./pages/Product/Viewproductlist.js";
import Addstock from "./pages/Stock/Addstock.js";
import Viewaddstock from "./pages/Stock/Viewaddstock.js";
import Revenueall from "./pages/revenue/Revenueall.js";
import Login from "./components/Basic/Login.js";
import Getconsumerbydealer from "./pages/clients/Getconsumerbydealer.js";
import Addcategory from "./pages/Product/Addcategory.js";
import Viewcategory from "./pages/Product/Viewcategory.js";
import { useEffect, useState } from "react";
import AddConsumer from "./pages/Dealers/Consumers/Addconsumer.js";
import ViewConsumers from "./pages/Dealers/Consumers/ViewConsumers.js";
import Yourorder from "./pages/Dealers/Orders/Yourorder.js";
import Consumersorder from "./pages/Dealers/Orders/Consumersorder.js";
import Productlist from "./pages/Dealers/Buynow/Productlist.js";
import Viewcart from "./pages/Dealers/Buynow/Viewcart.js";
import History from "./pages/Dealers/history/History.js";
import ALLProductlist from "./pages/Consumer/Buynow/allProductlist.js";
import DealerDashboard from "./pages/Home-copy/DealerDashboard.js";
import ALIviewcart from "./pages/Consumer/Buynow/ALlviewcart.js";
import ConsumerHistory from "./pages/Consumer/History/ConsumerHistory.js";
import Ourorder from "./pages/Consumer/orders/Ourorder.js";
import Dealer_order from "./pages/Orders/Dealer_order.js";
import Consumer_orders from "./pages/Orders/Consumer_orders.js";
import Totalearning from "./pages/Dealers/Comission/Totalearning.js";
import Userdashboard from "./pages/Userdashboard/Userdashboard.js";
import Dealersearning from "./pages/Dealerearning/Dealersearning.js";
import Addblog from "./pages/Blog/Addblog.js";
import Viewblogs from "./pages/Blog/Viewblogs.js";
import Independetuserdashboard from "./pages/Independetuser/Independetuser.js";
import Register from "./components/Basic/Register.js";

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  const [role, setRole] = useState(null); // State to hold the role of the user

  const navigate=useNavigate();
  useEffect(() => {
    const token = sessionStorage.getItem("Token");
    console.log("token is", token);
    if(!token){
      navigate("/")
    }
    const userRole = sessionStorage.getItem("Role");
    if (token && userRole) {
      setRole(userRole); // Set role if available
    }
  }, []);
  const [toggle, settoggle]= useState(false);

  return (
    <div>
      {!isLoginPage && <Header toggle={toggle} settoggle={settoggle} />}
      <div className="main d-flex">
        {/* Show sidebar based on the user's role */}
        {!isLoginPage && role && (
          <div className={`sidebarWrapper ${toggle === true ? 'show': ""} console.log("hello")`}>
            <Sidebar   /> 
          </div>
        )}
        <div className={isLoginPage ? "full-page" : "content"}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/adddealer" element={<AddClient />} />
            <Route path="/viewdealer" element={<ViewClient />} />
            <Route path="/getconsumers" element={<Getconsumerbydealer />} />
            <Route path="/addproduct" element={<AddProduct />} />
            <Route path="/viewconsumer" element={<Viewquotations />} />
            <Route path="/createbill" element={<Createbill />} />
            <Route path="/selectproduct" element={<Selectproduct />} />
            <Route path="/bill" element={<Genratebill />} />
            <Route path="/allbill" element={<Viewbilllist />} />
            <Route path="/reviewbillproduts" element={<Reviewbillpro />} />
            <Route path="/productlist" element={<Viewproductlist />} />
            <Route path="/addstockproduct" element={<Addstock />} />
            <Route path="/addcategory" element={<Addcategory />} />
            <Route path="/viewcategory" element={<Viewcategory />} />
            <Route path="/viewstock" element={<Viewaddstock />} />
            <Route path="/revenue" element={<Revenueall />} />
            <Route path="/dealerorders" element={<Dealer_order />} />
            <Route path="/cuslist" element={<Consumer_orders />} />
            <Route path="/dealersearning" element={<Dealersearning />} />

            {/* --------------------------------Dealer by consumers-------------------- */}
            <Route path="/dealerdashboard" element={<DealerDashboard />} />
            <Route path="/addconsumer" element={<AddConsumer />} />
            <Route path="/viewdealerconsumer" element={<ViewConsumers />} />
            <Route path="/orders" element={<Yourorder />} />
            <Route path="/consumerorders" element={<Consumersorder />} />

            {/* ----------------------------------Buy now ------------------- */}
            <Route path="/products" element={<Productlist />} />
            <Route path="/viewcart" element={<Viewcart />} />
            <Route path="/history" element={<History />} />
            <Route path="/earning" element={<Totalearning />} />

            {/* ---------------------------consumer routes----------------- */}
            <Route path="/userdashboard" element={<Userdashboard />} />
            {/* <Route path="/userdashboard" element={<History />} /> */}
            <Route path="/conproductlist" element={<ALLProductlist />} />
            <Route path="/viewcuscart" element={<ALIviewcart />} />
            <Route path="/cushistory" element={<ConsumerHistory />} />

            {/* ---------------------------------blog routes------------------ */}

            <Route path="/addblog" element={<Addblog />} />
            <Route path="/viewblog" element={<Viewblogs />} />

            {/* ----------------------Independetuser routes */}
            <Route path="/independetdashboard" element={<Independetuserdashboard />} />

            <Route path="/registeruser" element={<Register />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;