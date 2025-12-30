import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import DanhSachPage from "./pages/DanhSachNha";
import DanhSachDuAn from "./pages/DanhSachDuAn";
import ProductDetail from "./pages/ProductDetail";
import ProjectDetail from "./pages/ProjectDetail";
import ThueNhaPage from "./pages/ThueNhaPage";
import RentDetail from "./pages/RentDetail";

import PropertyDetailPage from "./pages/PropertyDetailPage";
import PropertyListPage from "./pages/PropertyListPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Tất cả trang muốn có Navbar/Footer thì nhét vào đây */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          {/* Nhà */}
          <Route path="/nha" element={<DanhSachPage />} />
          <Route path="/ProductDetail/:id" element={<ProductDetail />} />

          {/* Dự án */}
          <Route path="/duan" element={<DanhSachDuAn />} />
          <Route path="/ProjectDetail/:id" element={<ProjectDetail />} />

          {/* Thuê */}
          <Route path="/rent" element={<ThueNhaPage />} />
          <Route path="/rent/:id" element={<RentDetail />} />

          {/* Properties (mock) */}
          <Route path="/properties" element={<PropertyListPage />} />
          <Route path="/properties/:slug" element={<PropertyDetailPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
