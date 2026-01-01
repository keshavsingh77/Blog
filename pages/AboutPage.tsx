import React, { useEffect } from 'react';
import SEO from '../components/SEO';

const AboutPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen pt-24 pb-16 transition-colors duration-300">
      <SEO title="About Us" description="Learn more about Creative Mind - your source for viral tech tips, gaming, and internet culture." />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-8 border-l-8 border-blue-600 pl-6 uppercase tracking-tighter">
          About <span className="text-blue-600">Us</span>
        </h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-6">
          <p className="text-xl font-medium leading-relaxed">
            Welcome to <strong className="text-blue-600">Creative Mind</strong>, the digital frontier where technology meets viral creativity. 
            We are dedicated to uncovering the internet's most powerful secrets, from organic social media growth to the latest AI breakthroughs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-black text-blue-600 uppercase mb-4">Our Mission</h3>
              <p className="text-sm">To empower creators and tech enthusiasts with actionable insights, high-quality tutorials, and the latest news from the world of digital innovation.</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-black text-blue-600 uppercase mb-4">Our Vision</h3>
              <p className="text-sm">To become the world's leading hub for viral tech knowledge, helping millions of users navigate and master the ever-evolving landscape of internet culture.</p>
            </div>
          </div>

          <h2 className="text-2xl font-black text-gray-900 dark:text-white mt-12 mb-4 uppercase tracking-tight">What We Cover</h2>
          <p>
            Our team of digital wizards spends hundreds of hours researching the latest trends in:
          </p>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 list-none p-0">
            {['Tech Innovation', 'Viral Growth', 'AI Imagery', 'Gaming Secrets', 'Mobile Mastery', 'Social Media Algorithms'].map(item => (
              <li key={item} className="flex items-center text-sm font-bold bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700">
                <i className="fas fa-check-circle text-blue-500 mr-2"></i> {item}
              </li>
            ))}
          </ul>

          <div className="mt-16 p-10 bg-blue-600 rounded-[3rem] text-white text-center shadow-2xl">
            <h2 className="text-3xl font-black mb-4 italic">"Unlocking the Potential of the Digital World."</h2>
            <p className="opacity-90 max-w-2xl mx-auto">Founded in 2024, Creative Mind has quickly grown from a small blog to a viral powerhouse, trusted by thousands of tech-savvy readers every day.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;