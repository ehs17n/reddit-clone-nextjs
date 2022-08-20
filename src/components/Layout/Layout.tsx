import React, { ReactNode } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth } from '../../firebase/clientApp';
// import useAuth from '../../hooks/useAuth';

// import AuthModal from '../Modal/Auth';
import Navbar from '../Navbar/Navbar';

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  // useAuth(); // will implement later at end of tutorial

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default Layout;
