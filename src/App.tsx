import { HashRouter, Routes, Route, Link } from "react-router-dom";
import Home from "@/pages/Home";
import SpeciesDetail from "@/pages/SpeciesDetail";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/species/:id" element={<SpeciesDetail />} />
      </Routes>
    </HashRouter>
  );
}