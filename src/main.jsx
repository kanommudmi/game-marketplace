// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./views/Layout.jsx";
import ActionGamesPage from "./views/ActionGamesPage";
import RacingPage from "./views/RacingPage";
import SportsPage from "./views/SportsPage";
import RpgPage from "./views/RpgPage";
import StrategyPage from "./views/StrategyPage";
import ShootingPage from "./views/ShootingPage";
import LandingPage from "./views/LandingPage";
import ProductDetailPage from "./views/ProductDetailPage";
import CheckoutPage from "./views/CheckoutPage";
import ProfilePage from "./views/ProfilePage";
import LoginPage from "./views/LoginPage";
import RegisterPage from "./views/RegisterPage";
import RatingsPage from "./views/RatingsPage";
import UnauthorizedPage from "./views/UnauthorizedPage";
import AdminDashboard from "./views/AdminDashboard";
import GamesManagement from "./views/GamesManagement";
import OrdersManagement from "./views/OrdersManagement";
import UsersManagement from "./views/UsersManagement";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "@/components/ui/sonner";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: (
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-4xl">404 - Page Not Found 😭</h1>
      </div>
    ),
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          { path: "/", element: <LandingPage /> },
          { path: "/product/:id", element: <ProductDetailPage /> },
          { path: "/category/action", element: <ActionGamesPage /> },
          { path: "/category/racing", element: <RacingPage /> },
          { path: "/category/sports", element: <SportsPage /> },
          { path: "/category/rpg", element: <RpgPage /> },
          { path: "/category/strategy", element: <StrategyPage /> },
          { path: "/category/shooting", element: <ShootingPage /> },
          { path: "/checkout", element: <CheckoutPage /> },
          { path: "/profile", element: <ProfilePage /> },
          { path: "/ratings", element: <RatingsPage /> },
        ],
      },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/unauthorized", element: <UnauthorizedPage /> },
      {
        path: "/admin",
        element: (
          <ProtectedRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/games",
        element: (
          <ProtectedRoute>
            <AdminLayout>
              <GamesManagement />
            </AdminLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/orders",
        element: (
          <ProtectedRoute>
            <AdminLayout>
              <OrdersManagement />
            </AdminLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/users",
        element: (
          <ProtectedRoute>
            <AdminLayout>
              <UsersManagement />
            </AdminLayout>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <UserProvider>
      <CartProvider>
        <RouterProvider router={router} />
        <Toaster />
      </CartProvider>
    </UserProvider>
  </ThemeProvider>,
);
