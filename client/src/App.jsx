import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
// import danh sach
import DanhSachPage from "./pages/DanhSachNha";
import DanhSachDuAn from "./pages/DanhSachDuAn";
import ProductDetail from "./pages/ProductDetail";
import ProjectDetail from "./pages/ProjectDetail";
// import News from "./components/News";
import ThueNhaPage from "./pages/ThueNhaPage";
import RentDetail from "./pages/RentDetail";

function App() {
  return (
    <Router>
      <Routes>
        {/*Tất cả trang muốn có Navbar/Footer thì nhét vào đây */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          {/* trang hiển thị danh sách nhà */}
          <Route path="/nha" element={<DanhSachPage />} />
          {/* chuyển trang đến chi tiết nhà */}
          <Route path="/ProductDetail/:id" element={<ProductDetail />} />
          {/* chuyển trang hiển thị danh sach dự án */}
          <Route path="/duan" element={<DanhSachDuAn />} />
          {/* chuyển trang đến chi tiết dự án */}
          <Route path="/ProjectDetail/:id" element={<ProjectDetail />} />

          {/* <Route path="/tintuc" element={<News/>} /> */}

          {/* Thuê nhà */}
          <Route path="/rent" element={<ThueNhaPage />} />
          <Route path="/rent/:id" element={<RentDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
