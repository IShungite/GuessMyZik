import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import App from "./App";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";
import Register from "./pages/Register/Register";
import WaitingRoom from "./pages/WaitingRoom/WaitingRoom";

export default createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      <Route path="waiting-room" element={<WaitingRoom />} />
    </Route>
  )
);
