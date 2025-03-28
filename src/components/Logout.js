// src/components/Logout.js
import React from 'react';
import { useAppContext } from '../context/AppContext';

const Logout = () => {
  const { signout } = useAppContext();

  const handleLogout = async () => {
    try {
      await signout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Logout
    </button>
  );
};

export default Logout;
