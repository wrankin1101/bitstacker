// src/App.js
import React from "react";
import MainGrid from "./components/MainGrid";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Welcome from "./pages/Welcome";
import ScrollToAnchor from "./helpers/ScrollToAnchor";
import ProtectedRoute from "./context/ProtectedRoute";

const App = () => {
  return (
    <>
      <Routes>
        {/* Routes outside the Layout */}
        <Route index element={<Welcome />} />
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<Welcome />} />
        <Route path="/welcome" element={<Welcome />} />

        {/* Routes inside the Layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout children={<MainGrid />} />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ScrollToAnchor />
    </>
  );
};

export default App;
