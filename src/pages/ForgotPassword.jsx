/* ══════════════════════════════════════
    FORGOT PASSWORD (3-STEP)
══════════════════════════════════════ */
import { useState } from "react";

function ForgotPassword({ onNav, showToast }) {
    const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Pass
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [pass, setPass] = useState({ new: '', confirm: '' });

    // Mock "database" check
    const handleSubmitEmail = (e) => {
        e.preventDefault();
        // Check if email contains 'admin' or 'user' to simulate a "correct" email
        if (email.includes('@')) {
            showToast("Success! Code sent to " + email);
            setStep(2);
        } else {
            showToast("Incorrect email associated with any account", "error");
        }
    };

    const handleVerifyCode = (e) => {
        e.preventDefault();
        if (code.length === 5) {
            setStep(3);
        } else {
            showToast("Invalid 5-digit code", "error");
        }
    };

    const handleReset = (e) => {
        e.preventDefault();
        if (pass.new !== pass.confirm) return showToast("Passwords do not match", "error");
        showToast("Password updated successfully! 🎉");
        onNav('login');
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-white">Security</h1>
                    <p className="text-gray-500 mt-2">Recover your Able Enterprises account</p>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 space-y-6 shadow-2xl">
                    {step === 1 && (
                        <form onSubmit={handleSubmitEmail} className="space-y-4">
                            <h2 className="text-white font-bold text-xl">Find Your Account</h2>
                            <p className="text-gray-400 text-sm">Enter the email associated with your account.</p>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" required
                                className="w-full bg-black text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-[#004792]" />
                            <button type="submit" className="w-full bg-[#004792] text-white font-black py-4 rounded-xl">Search</button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVerifyCode} className="space-y-4">
                            <h2 className="text-white font-bold text-xl">Verification</h2>
                            <p className="text-gray-400 text-sm">Enter the 5-digit code sent to <b>{email}</b></p>
                            <input type="text" maxLength={5} value={code} onChange={e => setCode(e.target.value)} placeholder="00000" required
                                className="w-full bg-black text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-[#004792] text-center text-2xl tracking-[1em] font-mono" />
                            <button type="submit" className="w-full bg-[#004792] text-white font-black py-4 rounded-xl">Verify Code</button>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleReset} className="space-y-4">
                            <h2 className="text-white font-bold text-xl">New Password</h2>
                            <input type="password" value={pass.new} onChange={e => setPass({ ...pass, new: e.target.value })} placeholder="New Password" required
                                className="w-full bg-black text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-[#004792]" />
                            <input type="password" value={pass.confirm} onChange={e => setPass({ ...pass, confirm: e.target.value })} placeholder="Confirm Password" required
                                className="w-full bg-black text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-[#004792]" />
                            <button type="submit" className="w-full bg-[#004792] text-white font-black py-4 rounded-xl">Reset Password</button>
                        </form>
                    )}

                    <button onClick={() => onNav('login')} className="w-full text-gray-500 text-sm hover:text-white transition-colors">Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;