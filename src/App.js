// src/App.js
import React from 'react';
import Dashboard from './dashboard/Dashboard';

function App() {
  return (
    <><div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <h1 className="text-4xl font-bold text-primary mb-4">
        Crypto Portfolio Tracker
      </h1>
      <p className="text-lg text-white">
        Track your crypto holdings in real-time!
      </p>
      <button className="mt-6 px-6 py-2 bg-success text-black rounded-lg hover:bg-secondary">
        Get Started
      </button>
    </div><Dashboard /></>

  );
}

export default App;
