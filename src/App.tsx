import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home.tsx";
import SpeciesDetail from "@/pages/SpeciesDetail.tsx";
import Archive from "@/pages/Archive.tsx";
import ErrorPage from "@/pages/ErrorPage.tsx";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/species/:id" element={<SpeciesDetail />} />
        <Route path="*" element={<ErrorPage code={404} />} />
      </Routes>
    </HashRouter>
  );
}