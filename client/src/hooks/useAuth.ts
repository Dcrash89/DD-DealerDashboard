import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

// This is just a convenience export. The main logic is in AuthContext.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
