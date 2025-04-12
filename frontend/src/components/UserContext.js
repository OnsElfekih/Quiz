import { createContext, useState, useContext } from 'react';

// Create the context for the user
const UserContext = createContext();


// Custom hook to access the context
export const useUser = () => useContext(UserContext);


// The provider component to wrap around the app
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User state

  return (
    <UserContext.Provider value={{ user, setUser, useUser }}>
      {children}
    </UserContext.Provider>
  );
};
