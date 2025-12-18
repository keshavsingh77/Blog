
import React, { useEffect } from 'react';
import SEO from '../components/SEO';

const PrivacyPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen pt-24 pb-16 transition-colors duration-300">
      <SEO title="Privacy Policy" description="Privacy Policy for Creative Mind. Learn how we handle your data." />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-8 border-l-8 border-blue-600 pl-6">
          Privacy Policy
        </h1>
        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>At Creative Mind, we prioritize the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Creative Mind and how we use it.</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">1. Information Collection</h2>
          <p>We may collect personal information such as your name and email address when you subscribe to our newsletter or contact us directly. We also collect non-personal information through cookies to improve our user experience.</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">2. Log Files</h2>
          <p>Creative Mind follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">3. Google DoubleClick DART Cookie</h2>
          <p>Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet.</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">4. Your Consent</h2>
          <p>By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
