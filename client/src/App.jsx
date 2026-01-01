import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";

import PropertyDetailPage from "./pages/PropertyDetailPage";
import PropertyListPage from "./pages/PropertyListPage";
function App() {
  return (
    <Router>
      <Routes>
        {/* Tất cả trang muốn có Navbar/Footer thì nhét vào đây */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          {/* Properties (mock) */}
          <Route path="/properties" element={<PropertyListPage />} />
          <Route path="/properties/:slug" element={<PropertyDetailPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
