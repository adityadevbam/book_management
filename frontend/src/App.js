import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ForgotPassword from "./components/Auth/ForgotPassword";
import Home from "./pages/Home";
import CollectionPage from "./pages/CollectionPage";
import AddBooksPage from "./pages/AddBooksPage";
import ViewProfilePage from "./pages/ViewProfilePage";
import AccountSettingPage from "./pages/AccountSettingPage";
import ViewBookPage from "./pages/ViewBookPage";
import EditBooksPage from "./pages/EditBooksPage";
import PrivateRoute from "./utils/PrivateRoute"; 

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Private Routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/collection"
        element={
          <PrivateRoute>
            <CollectionPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/add"
        element={
          <PrivateRoute>
            <AddBooksPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/account"
        element={
          <PrivateRoute>
            <ViewProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <AccountSettingPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/view-book/:id"
        element={
          <PrivateRoute>
            <ViewBookPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/edit-book/:id"
        element={
          <PrivateRoute>
            <EditBooksPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
