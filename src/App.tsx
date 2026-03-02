import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import SpeciesDetail from "@/pages/SpeciesDetail";
import Archive from "@/pages/Archive";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/species/:id" element={<SpeciesDetail />} />
      </Routes>
    </HashRouter>
  );
}