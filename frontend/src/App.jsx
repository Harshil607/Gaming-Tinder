import GameCard from "./pages/GameCard";
import Recommendations from "./pages/Recommendations";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/protectedRoute";

function AppContent() {
  const location = useLocation();
  const token = localStorage.getItem("token");

  const showNavbar = token && location.pathname !== "/login";

  return (
    <>
      {showNavbar && <NavBar />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <GameCard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recommendations"
          element={
            <ProtectedRoute>
              <Recommendations />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
