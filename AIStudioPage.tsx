import React from 'react';
import { Navigate } from 'react-router-dom';

const AIStudioPage: React.FC = () => {
    // Feature Removed. Redirecting to home.
    return <Navigate to="/" replace />;
};

export default AIStudioPage;