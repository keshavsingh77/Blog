import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';

const BOT_USERNAME = "SDMOVIEPOINT_bot"; // Updated bot name
const TIMER_SECONDS = 15;

const SafeLink: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const location = useLocation();
    const navigate = useNavigate();
    const { posts } = useBlog();

    const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
    const [isReady, setIsReady] = useState(false);
    const isHomePage = location.pathname === "/";

    useEffect(() => {
        if (token) {
            localStorage.setItem('bot_file_token', token);
        }

        if (token && isHomePage && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setIsReady(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [token, isHomePage, timeLeft]);

    if (!token || !isHomePage) return null;

    const handleVerify = () => {
        if (posts && posts.length > 0) {
            const randomPost = posts[Math.floor(Math.random() * posts.length)];
            navigate(`/post/${randomPost.id}?token=${token}`);
        } else {
            alert("No posts available for verification.");
        }
    };

    return (
        <div className="fixed inset-0 z-[2000] bg-gray-950 flex items-center justify-center overflow-hidden p-4 md:p-8">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse [animation-delay:1s]"></div>
            </div>

            <div className="relative max-w-2xl w-full bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-16 text-center shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] animate-fade-in-up">
                <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-10">
                    <i className="fas fa-shield-halved"></i> Secure Link Gateway
                </div>

                <div className="mb-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-white text-4xl shadow-[0_20px_40px_-5px_rgba(59,130,246,0.5)]">
                        {isReady ? (
                            <i className="fas fa-check animate-bounce"></i>
                        ) : (
                            <i className="fas fa-shield-virus animate-pulse"></i>
                        )}
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-6">
                        {isReady ? "Encrypted Link Ready" : "Decrypting Secure Link"}
                    </h2>

                    <p className="text-gray-400 text-lg md:text-xl font-medium max-w-lg mx-auto leading-relaxed">
                        {isReady
                            ? "Verification successful. You can now proceed to your content securely."
                            : `Please wait while our system validates your request. decryption in ${timeLeft}s...`}
                    </p>
                </div>

                {!isReady && (
                    <div className="w-full h-2 bg-white/5 rounded-full mb-12 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-1000 ease-linear"
                            style={{ width: `${((TIMER_SECONDS - timeLeft) / TIMER_SECONDS) * 100}%` }}
                        ></div>
                    </div>
                )}

                <button
                    onClick={handleVerify}
                    disabled={!isReady}
                    className={`group w-full py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-sm transition-all shadow-[0_20px_50px_rgba(59,130,246,0.3)] flex items-center justify-center gap-4 ${isReady
                        ? "bg-white text-gray-950 hover:bg-blue-600 hover:text-white hover:scale-[1.02] active:scale-95"
                        : "bg-white/5 text-white/20 cursor-not-allowed border border-white/5 shadow-none"
                        }`}
                >
                    {isReady ? (
                        <>
                            Access Content
                            <i className="fas fa-arrow-right-long transition-transform group-hover:translate-x-2"></i>
                        </>
                    ) : "Securing Connection..."}
                </button>

                <div className="mt-12 flex items-center justify-center gap-6 opacity-30">
                    <i className="fab fa-telegram-plane text-2xl text-white"></i>
                    <span className="w-px h-4 bg-white/20"></span>
                    <i className="fas fa-lock text-xl text-white"></i>
                    <span className="w-px h-4 bg-white/20"></span>
                    <i className="fas fa-user-shield text-2xl text-white"></i>
                </div>
            </div>
        </div>
    );
};

export default SafeLink;
