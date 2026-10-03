import GameCard from "./pages/GameCard";
import Recommendations from "./pages/Recommendations";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <NavBar />

      <Routes>
        <Route path="/" element={<GameCard />} />
        <Route path="/recommendations" element={<Recommendations />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
