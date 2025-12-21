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

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: (
      // You can write JSX in here by ()
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-4xl">404 - Page NOt Found 😭</h1>
      </div>
    ),
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          { path: "/", element: <LandingPage /> },
          { path: "/category/action", element: <ActionGamesPage /> },
          { path: "/category/racing", element: <RacingPage /> },
          { path: "/category/sports", element: <SportsPage /> },
          { path: "/category/rpg", element: <RpgPage /> },
          { path: "/category/strategy", element: <StrategyPage /> },
          { path: "/category/shooting", element: <ShootingPage /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(<RouterProvider router={router} />);
