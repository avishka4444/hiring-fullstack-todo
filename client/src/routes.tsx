import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Todos from "./screens/Todos";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Todos />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

