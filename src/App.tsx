import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ComparePage } from "./pages/ComparePage";
import { ProfilePage } from "./pages/ProfilePage";
import { SearchPage } from "./pages/SearchPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/u/:username" element={<ProfilePage />} />
        <Route path="/compare/:user1/:user2" element={<ComparePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
