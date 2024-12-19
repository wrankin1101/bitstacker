import React, { createContext, useState, useContext } from 'react';
import api from '../services/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activePortfolio, setPortfolio] = useState(null);
  
    const login = async (email, password) => {
      setIsLoading(true);
      setError(null);
      try {
        const userData = await api.loginUser(email, password);

        //testing createUser end-to-end 
        //const testUser = await api.createUser('test', 'test'+email, password); 
        //console.log('testUser',testUser);
        
        console.log(userData);
        setUser(userData); 
      } catch (err) {
        setError(err.response?.data?.error || "An error occurred during login");
        setIsLoading(false);
      } finally {
      }
    };
  
    const logout = () => {
        setIsLoading(false);
        setError(null);
        setUser(null); // Clear user state
      // Optionally clear tokens or local storage
    };
  
    return (
      <UserContext.Provider value={{ user, login, logout, isLoading, error }}>
        {children}
      </UserContext.Provider>
    );
  };

export const useUser = () => useContext(UserContext);
