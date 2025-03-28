// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';
import Login from './components/Login';
import Logout from './components/Logout'; // Import the Logout component
import { AppProvider } from './context/AppContext';
import './styles/globals.css';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          {/* Add a Logout component */}
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
