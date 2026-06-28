import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import PassengerDashboard from "./pages/PassengerDashboard";


function PaymentRedirect() {
  const location = useLocation();
  const navigate = useNavigate();
    useEffect(() => {
    const params = new URLSearchParams(location.search);
    const payment = params.get("payment");
    const txRef = params.get("txRef");
    if (payment && txRef) {
      navigate(`/passenger?payment=${payment}&txRef=${txRef}`);
    }
  }, []);

  return <div>Redirecting...</div>;
}

// Protected Route
function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "driver") return <Navigate to="/driver" replace />;
    return <Navigate to="/passenger" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver"
          element={
            <ProtectedRoute allowedRoles={["driver"]}>
              <DriverDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<PaymentRedirect />} />
        <Route
          path="/passenger"
          element={
            <ProtectedRoute allowedRoles={["passenger"]}>
              <PassengerDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;