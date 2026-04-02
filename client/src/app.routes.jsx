import { createBrowserRouter } from "react-router";
import Terms from "./pages/Terms";
import LegalPrivacy from "./pages/LegalPrivacy";
import { AuthLayout } from "./pages/AuthLayout";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <AuthLayout />,
  },
  {
    path: "/signup",
    element: <AuthLayout />,
  },
  {
    path: "/terms",
    element: <Terms />,
  },
  {
    path: "/privacy",
    element: <LegalPrivacy />,
  },
]);
