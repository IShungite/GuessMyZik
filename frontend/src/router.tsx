import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import App from "./App";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Game from "./pages/Game/Game";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

export default createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
      </Route>

      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      <Route path="game" element={<Game />} />
    </Route>
  )
);
