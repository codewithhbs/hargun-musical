import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Shop from "./pages/Shop/Shop";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import CategoryPage from "./pages/CategoryPage/CategoryPage";
import Login from "./pages/Auth/Login";
import Registration from "./pages/Auth/Registration";
import Forget from "./pages/Auth/Forget";
import VerifyOtp from "./pages/Auth/VerifyOtp";
import Profile from "./pages/Profile/Profile";
import Privacy from "./pages/Privacy/Privacy";
import Term from "./pages/Term/Term";
import Cart from "./pages/Cart/Cart";
import OrderSuccess from "./pages/Cart/OrderSuccess";
import Checkout from "./pages/Cart/Checkout";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product-detail/:slug" element={<ProductDetail />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/forget-password" element={<Forget />} />
        <Route path="/Verify-Otp" element={<VerifyOtp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/term" element={<Term />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/Order-Success" element={<OrderSuccess />} />
      </Routes>
      <Toaster />
      <Footer />
    </Router>
  );
};

export default App;
