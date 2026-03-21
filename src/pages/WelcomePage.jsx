function WelcomePage({ onNav }) {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-6">
            <div className="w-full max-w-md text-center">
                <div className="mb-12">
                    <div className="w-20 h-20 bg-[#004792] rounded-2xl flex items-center justify-center mx-auto mb-6 font-black text-white text-4xl">AE</div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Experience Premium Tech</h1>
                    <p className="text-gray-500 mt-2">The home of quality TVs and Mobile devices.</p>
                </div>

                <div className="space-y-4">
                    <button onClick={() => onNav('signup')} className="w-full bg-[#004792] hover:bg-[#00366d] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#004792]/20">
                        Create Account
                    </button>

                    <button onClick={() => onNav('login')} className="w-full bg-white hover:bg-gray-100 text-black font-bold py-4 rounded-xl transition-all">
                        Sign In
                    </button>

                    <button onClick={() => onNav('dashboard')} className="w-full py-4 text-gray-500 hover:text-white font-medium transition-colors">
                        Continue Browsing as Guest
                    </button>
                </div>
            </div>
        </div>
    );
}

export default WelcomePage