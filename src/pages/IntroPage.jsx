import React from "react";
function IntroPage({ onNav }) {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-6">
            <div className="w-full max-w-md text-center">
                <div className="mb-10">
                    <div className="w-20 h-20 bg-[#0040FF] rounded-2xl flex items-center justify-center mx-auto mb-6 font-black text-white text-4xl">AE</div>
                    <h1 className="text-4xl font-black text-white mb-2">Able Enterprises</h1>
                    <p className="text-gray-400">Premium TVs, Phones & Accessories</p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => onNav('signup')}
                        className="w-full bg-[#004792] hover:bg-[#0040FF] text-white font-bold py-4 rounded-xl transition-all shadow-lg"
                    >
                        Create Account
                    </button>

                    <button
                        onClick={() => onNav('login')}
                        className="w-full bg-white hover:bg-gray-100 text-black font-bold py-4 rounded-xl transition-all"
                    >
                        Sign In
                    </button>

                    <div className="pt-4">
                        <button
                            onClick={() => onNav('dashboard')}
                            className="text-gray-500 hover:text-[#0040FF] font-medium transition-colors"
                        >
                            Continue as Guest
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default IntroPage;