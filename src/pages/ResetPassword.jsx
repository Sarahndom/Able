import { useState } from "react";

function ResetPassword({ onNav, showToast }) {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate API Call
        setSent(true);
        showToast("Reset link sent to your email!");
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-black">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-white">Reset Password</h1>
                    <p className="text-gray-500 mt-2">
                        {sent ? "Check your inbox for instructions" : "Enter your email to receive a reset link"}
                    </p>
                </div>

                {!sent ? (
                    <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-6">
                        <div>
                            <label className="text-gray-400 text-sm block mb-1.5">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                required
                                className="w-full bg-black text-white px-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-[#004792] transition-colors"
                            />
                        </div>
                        <button type="submit" className="w-full bg-[#004792] text-white font-bold py-3.5 rounded-xl">
                            Send Reset Link
                        </button>
                        <button type="button" onClick={() => onNav('login')} className="w-full text-gray-500 text-sm">
                            Back to Login
                        </button>
                    </form>
                ) : (
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
                        <button onClick={() => onNav('login')} className="w-full bg-[#004792] text-white font-bold py-3.5 rounded-xl">
                            Return to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
export default ResetPassword;