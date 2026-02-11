import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import GoogleAd from '../components/GoogleAd';
import { useBlog } from '../context/BlogContext';

const TIMER_SECONDS = 8;

const SafeLinkPage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [countdown, setCountdown] = useState(TIMER_SECONDS);
    const { posts } = useBlog();
    const [isReady, setIsReady] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const getLinkSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initiate timing handshake with server
        if (token) {
            fetch(`/api/verify?token=${token}&action=start`).catch(err => console.error('Handshake failed', err));
        }

        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setIsReady(true);
        }
    }, [countdown, token]);

    const handleGetLink = () => {
        if (isReady && isVerified && token) {
            window.location.href = `/api/get?token=${token}`;
        }
    };

    const handleVerify = () => {
        if (!isReady || posts.length === 0) {
            return;
        }

        const randomPost = posts[Math.floor(Math.random() * posts.length)];
        window.open(`/post/${randomPost.id}`, '_blank', 'noopener,noreferrer');
        setIsVerified(true);
    };

    const handleContinue = () => {
        if (!isVerified) {
            return;
        }

        getLinkSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12 px-4">
            <SEO
                title="Secure Link Gateway | Creative Mind"
                description="Please wait while we verify your link and prepare the destination."
            />

            <div className="max-w-4xl mx-auto space-y-8">
                {/* Top Ad */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 min-h-[100px] flex items-center justify-center">
                    <GoogleAd />
                </div>

                {/* Main Gateway Card */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    {/* Glassmorphism Accents */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none"></div>

                    <div className="relative text-center space-y-8">
                        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full">
                            <i className="fas fa-shield-halved"></i> Link Verification System
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
                                {isReady ? "Verification Complete!" : "Validating Your Request"}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto font-medium">
                                {!token
                                    ? 'Invalid or missing token. Please request a fresh safe link from the bot.'
                                    : isReady
                                        ? 'Timer complete. Open a verification post, then continue to unlock the original file link.'
                                        : `Our security layer is decrypting your destination. Please wait ${countdown} seconds...`}
                            </p>
                        </div>

                        {/* Countdown / Progress Circle */}
                        <div className="flex justify-center py-4">
                            {!isReady ? (
                                <div className="relative w-32 h-32 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="60"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            className="text-gray-200 dark:text-gray-800"
                                        />
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="60"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            strokeDasharray={377}
                                            strokeDashoffset={377 - (377 * (TIMER_SECONDS - countdown)) / TIMER_SECONDS}
                                            className="text-blue-600 dark:text-blue-400 transition-all duration-1000 ease-linear"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <span className="absolute text-4xl font-black text-gray-900 dark:text-white">
                                        {countdown}
                                    </span>
                                </div>
                            ) : (
                                <div className="w-32 h-32 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center text-green-500">
                                    <i className="fas fa-check text-5xl"></i>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <button
                                onClick={handleVerify}
                                disabled={!isReady || !token}
                                className={`w-full px-8 py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${isReady && token
                                    ? 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-[1.02]'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {isVerified ? 'Open Another Verify Post' : 'Verify'}
                            </button>

                            <button
                                onClick={handleContinue}
                                disabled={!isVerified}
                                className={`w-full px-8 py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${isVerified
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02]'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Continue
                            </button>
                        </div>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {isVerified
                                ? 'Verification post opened. Click Continue to move to the final Get Link section.'
                                : 'After timer completion, click Verify to open a random post in a new tab.'}
                        </p>
                    </div>
                </div>

                {/* Bottom Ad */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 min-h-[250px] flex items-center justify-center">
                    <GoogleAd />
                </div>

                <div
                    ref={getLinkSectionRef}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 md:p-10 shadow-xl"
                >
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-3">
                        Final Step: Get Original Link
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        This button unlocks the original file URL generated by your Telegram bot token.
                    </p>

                    <button
                        onClick={handleGetLink}
                        disabled={!isReady || !isVerified || !token}
                        className={`w-full md:w-auto px-12 py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${(isReady && isVerified && token)
                            ? 'bg-green-600 text-white hover:bg-green-700 hover:scale-[1.05] shadow-[0_20px_40px_rgba(22,163,74,0.3)]'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        Get Link
                    </button>
                </div>

                <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-600 font-medium tracking-tight">
                        Deeply protected by Creative Mind Security Shell &copy; 2026
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SafeLinkPage;
