import { createBrowserRouter } from "react-router-dom";
import { CartContextProvider } from "../cart/CartContext.jsx";
import { AuthProvider } from "../auth/AuthContext";
import ProtectedRoute from "../auth/ProtectedRoute";
import Layout from "../Layout";
import Home from "../components/Home";
import Contact from "../Pages/Contact";
import Orders from "../dashboard/customer/Orders";
import Shop from "../products/Shop";
import Login from "../auth/Login";
import Signup from "../auth/Signup";
import ForgotPassword from "../auth/ForgotPassword";
import UserProfilePage from "../dashboard/customer/UserProfilePage";
import AccountSettingsPage from "../dashboard/customer/AccountSettingsPage";
import ProductDetailPage from "../products/ProductDetailPage";
import ShoppingCartPage from "../cart/ShoppingCartPage";
import CheckoutPage from "../cart/CheckoutPage";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../dashboard/admin/AdminDashboard";
import AdminProducts from "../dashboard/admin/AdminProducts";
import AdminUsers from "../dashboard/admin/AdminUsers";
import AdminOrders from "../dashboard/admin/AdminOrders";
import AdminEditProduct from "../dashboard/admin/AdminEditProduct";
import AdminAddProduct from "../dashboard/admin/AdminAddProduct";
import SellerLayout from "../layouts/SellerLayout";
import SellerDashboard from "../dashboard/seller/SellerDashboard";
import SellerProducts from "../dashboard/seller/SellerProducts";
import SellerOrders from "../dashboard/seller/SellerOrders";
import SellerEarnings from "../dashboard/seller/SellerEarnings";
import AddProduct from "../dashboard/seller/AddProduct";
import AdminCategories from "../dashboard/admin/AdminCategories";
import CustomerDashboard from "../dashboard/customer/CustomerDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "contact", element: <Contact /> },
      { path: "shop", element: <Shop /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "cart", element: <ShoppingCartPage /> },
      { path: "product/:id", element: <ProductDetailPage /> },
      // Add routes for all missing pages
      { path: "deals", element: <div>Deals page coming soon</div> },
      { path: "new", element: <div>New arrivals page coming soon</div> },
      { path: "bestsellers", element: <div>Bestsellers page coming soon</div> },
      { path: "about", element: <div>About us page coming soon</div> },
      { path: "careers", element: <div>Careers page coming soon</div> },
      { path: "press", element: <div>Press page coming soon</div> },
      { path: "blog", element: <div>Blog page coming soon</div> },
      { path: "help", element: <div>Help center coming soon</div> },
      { path: "faq", element: <div>FAQ page coming soon</div> },
      { path: "shipping", element: <div>Shipping info coming soon</div> },
      { path: "privacy", element: <div>Privacy policy coming soon</div> },
      { path: "terms", element: <div>Terms of service coming soon</div> },
      { path: "cookies", element: <div>Cookie policy coming soon</div> },
      { path: "refund", element: <div>Refund policy coming soon</div> },
      // Protected customer routes
      {
        path: "orders",
        element: (
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <AccountSettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "checkout",
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  // {
  //   path: "/customer",
  //   element: (
  //     <ProtectedRoute requiredRole="customer">
  //       <Layout />
  //     </ProtectedRoute>
  //   ),
  //   children: [
  //     { index: true, element: <CustomerDashboard /> },
  //   ],
  // },
  {
    path:"/admin",
    element: (
    <ProtectedRoute requiredRole="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index:"/admin", element: <AdminDashboard /> },
      { path: "products", element: <AdminProducts /> },
      { path: "products/add", element: <AdminAddProduct /> },
      { path: "products/edit/:id", element: <AdminEditProduct /> },
      { path: "categories", element: <AdminCategories /> },
      { path: "users", element: <AdminUsers /> },
      { path: "orders", element: <AdminOrders /> },
    ],
  },
  // {
  //   path: "/seller",
  //   element: (
  //     <ProtectedRoute requiredRole="seller">
  //       <SellerLayout />
  //     </ProtectedRoute>
  //   ),
  //   children: [
  //     { index: true, element: <SellerDashboard /> },
  //     { path: "products", element: <SellerProducts /> },
  //     { path: "add-product", element: <AddProduct /> },
  //     { path: "edit-product/:id", element: <AddProduct /> },
  //     { path: "orders", element: <SellerOrders /> },
  //     { path: "earnings", element: <SellerEarnings /> },
  //   ],
  // },
]);

export default router;