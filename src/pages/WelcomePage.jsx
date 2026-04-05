import { User, LogIn, UserPlus } from "lucide-react";

function WelcomePage({ onNav }) {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-6">
            <div className="w-full max-w-md">

                {/* Logo + Branding */}
                <div className="text-center mb-10 sm:mb-12">
                    <div className="w-20 h-20 bg-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-5 font-black text-white text-4xl shadow-2xl shadow-blue-700/30">
                        AE
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                        Able<span className="text-blue-600">Enterprise</span>
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm sm:text-base">
                        Premium TVs, Phones & Accessories
                    </p>
                </div>

                {/* Buttons */}
                <div className="space-y-3">

                    {/* Create Account */}
                    <button
                        onClick={() => onNav('signup')}
                        className="w-full flex items-center justify-center gap-3 bg-blue-700 hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-700/20 text-base"
                    >
                        <UserPlus size={18} />
                        Create Account
                    </button>

                    {/* Sign In */}
                    <button
                        onClick={() => onNav('login')}
                        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-black font-bold py-4 rounded-xl transition-all text-base"
                    >
                        <LogIn size={18} />
                        Sign In
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 py-1">
                        <div className="flex-1 h-px bg-gray-800" />
                        <span className="text-gray-600 text-xs uppercase tracking-wider">or</span>
                        <div className="flex-1 h-px bg-gray-800" />
                    </div>

                    {/* Guest */}
                    <button
                        onClick={() => onNav('home')}
                        className="w-full flex items-center justify-center gap-3 border border-gray-800 hover:border-blue-500/40 text-gray-400 hover:text-gray-200 font-medium py-3.5 rounded-xl transition-all text-sm"
                    >
                        <User size={16} />
                        Continue Browsing as Guest
                    </button>

                    {/* Guest disclaimer */}
                    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
                        <p className="text-gray-500 text-xs leading-relaxed text-center">
                            <span className="text-gray-400 font-semibold">Guest access:</span> Browse all products freely.
                            To add items to your cart or place orders, you'll need a free account.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default WelcomePage;