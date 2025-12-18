
import React, { useEffect } from 'react';
import SEO from '../components/SEO';

const TermsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen pt-24 pb-16 transition-colors duration-300">
      <SEO title="Terms of Service" description="Terms of Service for Creative Mind. Please read our rules of engagement." />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-8 border-l-8 border-indigo-600 pl-6">
          Terms of Service
        </h1>
        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>Welcome to Creative Mind. By accessing this website, we assume you accept these terms and conditions. Do not continue to use Creative Mind if you do not agree to take all of the terms and conditions stated on this page.</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">1. Intellectual Property Rights</h2>
          <p>Other than the content you own, under these Terms, Creative Mind and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted limited license only for purposes of viewing the material contained on this Website.</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">2. Restrictions</h2>
          <p>You are specifically restricted from all of the following: publishing any Website material in any other media; selling, sublicensing and/or otherwise commercializing any Website material; publicly performing and/or showing any Website material.</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">3. Content Liability</h2>
          <p>We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website.</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">4. Disclaimer</h2>
          <p>To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
