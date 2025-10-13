
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} AI Gov & Finance News Hub. All rights reserved.</p>
          <p className="mt-1">Powered by AI, Built for Information</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
