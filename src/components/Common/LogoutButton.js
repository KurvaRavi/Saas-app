import React from 'react';
import { useHistory } from 'react-router-dom';

const LogoutButton = () => {
  const history = useHistory();

  const handleLogout = () => {
    // Perform logout actions
    // Example: Redirect to login page
    history.push('/login'); // Replace with your logout logic
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
}

export default LogoutButton;
