import PropTypes from 'prop-types';
import React, { createContext, useState, useEffect, useMemo } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(sessionStorage.getItem('userId') || null);

  useEffect(() => {
    if (userId) {
      sessionStorage.setItem('userId', userId);
    }
  }, [userId]);

  const value = useMemo(() => ({ userId, setUserId }), [userId]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,  // Add prop validation for 'children'
};

