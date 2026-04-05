```jsx
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

function ResetPassword({ onNav, showToast }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [sent, setSent] = useState(false);
    const [isRecovery, setIsRecovery] = useState(false);

    // Detect if user came from email recovery link
    useEffect(() => {
        const hash = window.location.hash;

        if (hash && hash.includes("access_token")) {
            setIsRecovery(true);
        }
    }, []);

    // STEP 1: Send reset email
    const handleEmailSubmit = async (e) => {
        e.preventDefault();

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: "http://localhost:3000/reset-password",
        });

        if (error) {
            showToast(error.message, "error");
        } else {
            setSent(true);
            showToast("Reset link sent to your email!");
        }
    };

    // STEP 2: Update password after clicking email link
    const handlePasswordReset = async (e) => {
        e.preventDefault();

        const { error } = await supabase.auth.updateUser({
            password: password,
        });

        if (error) {
            showToast(error.message, "error");
        } else {
            showToast("Password updated successfully!");
            onNav('login');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-black">
            <div className="w-full max-w-md">

                {/* HEADER */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-white">
                        {isRecovery ? "Set New Password" : "Reset Password"}
                    </h1>
                    <p className="text-gray-500 mt-2">
                        {isRecovery
                            ? "Enter your new password below"
                            : sent
                                ? "Check your inbox for instructions"
                                : "Enter your email to receive a reset link"}
                    </p>
                </div>

                {/* ───────── RECOVERY MODE (SET PASSWORD) ───────── */}
                {isRecovery ? (
                    <form onSubmit={handlePasswordReset} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-6">
                        <div>
                            <label className="text-gray-400 text-sm block mb-1.5">New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                required
                                className="w-full bg-black text-white px-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-[#004792]"
                            />
                        </div>

                        <button type="submit" className="w-full bg-[#004792] text-white font-bold py-3.5 rounded-xl">
                            Update Password
                        </button>
                    </form>
                ) : !sent ? (

                    /* ───────── SEND EMAIL ───────── */
                    <form onSubmit={handleEmailSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-6">
                        <div>
                            <label className="text-gray-400 text-sm block mb-1.5">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                required
                                className="w-full bg-black text-white px-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-[#004792]"
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

                    /* ───────── SUCCESS STATE ───────── */
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                            ✓
                        </div>

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
```
