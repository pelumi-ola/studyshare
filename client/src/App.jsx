import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Protected from "./components/Guards";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Resources from "./pages/Resources";
import ResourceDetail from "./pages/ResourceDetail";
import Upload from "./pages/Upload";
import MyResources from "./pages/MyResources";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Auth mode="login" />} />
        <Route path="register" element={<Auth mode="register" />} />
        <Route
          path="resources"
          element={
            <Protected>
              <Resources />
            </Protected>
          }
        />
        <Route
          path="resources/:id"
          element={
            <Protected>
              <ResourceDetail />
            </Protected>
          }
        />
        <Route
          path="upload"
          element={
            <Protected>
              <Upload />
            </Protected>
          }
        />
        <Route
          path="my-resources"
          element={
            <Protected>
              <MyResources />
            </Protected>
          }
        />
        <Route
          path="profile"
          element={
            <Protected>
              <Profile />
            </Protected>
          }
        />
        <Route
          path="admin"
          element={
            <Protected admin>
              <Admin />
            </Protected>
          }
        />
        <Route
          path="*"
          element={
            <p className="py-20 text-center text-lg">
              That page doesn't exist.
            </p>
          }
        />
      </Route>
    </Routes>
  );
}
