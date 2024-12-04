// src/App.js
import React from "react";
import { Link } from "react-router-dom";

function Welcome() {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Crypto Portfolio Tracker
        </h1>
        <p className="text-lg text-white">
          Track your crypto holdings in real-time!
        </p>

        <Link
          to="/dashboard" // Link to the dashboard route
          className="mt-6 px-6 py-2 bg-success text-black rounded-lg hover:bg-secondary">
          Get Started
        </Link>
      </div>
    </>
  );
}

export default Welcome;
