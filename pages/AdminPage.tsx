
import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
  // Admin feature has been removed as per request.
  return <Navigate to="/" replace />;
};

export default AdminPage;
