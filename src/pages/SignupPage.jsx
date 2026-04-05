import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.332 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L37.618 9.38C34.187 6.176 29.35 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039L37.618 9.38C34.187 6.176 29.35 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.314 0-9.828-3.441-11.357-8.205l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
);

export default function SignupPage({ onNav, showToast }) {
    const [f, setF]           = useState({ name: "", email: "", pass: "", confirm: "" });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading]   = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError]   = useState("");
    const [success, setSuccess] = useState(false);

    /* ── Google OAuth ── */
    const signUpWithGoogle = async () => {
        setGoogleLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: window.location.origin },
        });
        if (error) { showToast(error.message, "error"); setGoogleLoading(false); }
    };

    /* ── Manual sign up ── */
    const submit = async (e) => {
        e.preventDefault();
        setError("");

        if (!f.name.trim())          return setError("Please enter your full name.");
        if (f.pass.length < 6)       return setError("Password must be at least 6 characters.");
        if (f.pass !== f.confirm)    return setError("Passwords do not match.");

        setLoading(true);

        try {
            const { data, error: signUpErr } = await supabase.auth.signUp({
                email: f.email.trim().toLowerCase(),
                password: f.pass,
                options: {
                    data: { full_name: f.name.trim(), pass: f.pass },
                },
            });

            if (signUpErr) {
                // ── Duplicate email — redirect to login ──
                if (
                    signUpErr.message.includes("already registered") ||
                    signUpErr.message.includes("already exists") ||
                    signUpErr.message.includes("User already")
                ) {
                    setError(""); // clear error — show friendly message below
                    showToast("An account with this email already exists.", "error");
                    setTimeout(() => onNav("login"), 2200);
                    setError("An account with this email already exists. Redirecting you to sign in…");
                    return;
                }
                setError(signUpErr.message);
                return;
            }

            // Supabase returns identities: [] if email already confirmed (duplicate)
            if (data?.user?.identities?.length === 0) {
                showToast("Account already exists with this email.", "error");
                setTimeout(() => onNav("login"), 2000);
                setError("This email is already registered. Redirecting you to sign in…");
                return;
            }

            setSuccess(true);
            showToast("Account created! Check your email to verify. 📩");

        } catch (err) {
            if (err?.message?.includes("fetch") || err?.message?.includes("Failed to fetch")) {
                setError("Connection failed. Ensure http://localhost:5173 is added to your Supabase allowed URLs.");
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    /* ── Success screen ── */
    if (success) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md text-center">
                <CheckCircle2 size={72} className="text-green-500 mx-auto mb-5" />
                <h2 className="text-2xl font-black text-white mb-3">Check Your Email</h2>
                <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                    We sent a confirmation link to <strong className="text-white">{f.email}</strong>.
                    Click it to activate your account, then sign in.
                </p>
                <button onClick={() => onNav("login")} className="bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-3.5 rounded-2xl transition-all">
                    Go to Sign In →
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 font-black text-white text-2xl shadow-2xl shadow-blue-600/30">AE</div>
                    <h1 className="text-3xl font-black text-white">Create Account</h1>
                    <p className="text-blue-400 font-bold text-sm mt-1">Able Enterprise</p>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-7 sm:p-8 space-y-4 shadow-2xl">

                    {error && (
                        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-3.5">
                            <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-red-400 text-xs leading-relaxed">{error}</p>
                                {error.includes("already registered") || error.includes("already exists") || error.includes("Redirecting") ? (
                                    <button onClick={() => onNav("login")} className="text-blue-400 text-xs mt-1.5 font-bold hover:underline">
                                        → Sign in instead
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    )}

                    {/* Google */}
                    <button onClick={signUpWithGoogle} disabled={googleLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-bold py-3 rounded-xl transition-all disabled:opacity-60 border border-gray-200">
                        {googleLoading
                            ? <span className="w-5 h-5 border-2 border-gray-400/30 border-t-gray-600 rounded-full animate-spin" />
                            : <GoogleIcon />}
                        Sign up with Google
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-800" />
                        <span className="text-gray-600 text-xs font-bold uppercase">or</span>
                        <div className="flex-1 h-px bg-gray-800" />
                    </div>

                    {/* Manual form */}
                    <form onSubmit={submit} className="space-y-4">
                        {[
                            { key: "name",    label: "Full Name",   type: "text",     ph: "John Smith" },
                            { key: "email",   label: "Email",       type: "email",    ph: "you@example.com" },
                        ].map(({ key, label, type, ph }) => (
                            <div key={key}>
                                <label className="text-gray-400 text-xs block mb-1.5 font-semibold uppercase tracking-wide">{label}</label>
                                <input type={type} value={f[key]} placeholder={ph} required
                                    onChange={e => { setF(p => ({ ...p, [key]: e.target.value })); setError(""); }}
                                    className="w-full bg-black text-white px-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-blue-500 text-sm transition-colors" />
                            </div>
                        ))}

                        <div>
                            <label className="text-gray-400 text-xs block mb-1.5 font-semibold uppercase tracking-wide">Password</label>
                            <div className="relative">
                                <input type={showPass ? "text" : "password"} value={f.pass} placeholder="At least 6 characters" required
                                    onChange={e => { setF(p => ({ ...p, pass: e.target.value })); setError(""); }}
                                    className="w-full bg-black text-white px-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-blue-500 text-sm pr-11 transition-colors" />
                                <button type="button" onClick={() => setShowPass(s => !s)} tabIndex={-1}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300">
                                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="text-gray-400 text-xs block mb-1.5 font-semibold uppercase tracking-wide">Confirm Password</label>
                            <input type={showPass ? "text" : "password"} value={f.confirm} placeholder="Repeat password" required
                                onChange={e => { setF(p => ({ ...p, confirm: e.target.value })); setError(""); }}
                                className="w-full bg-black text-white px-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-blue-500 text-sm transition-colors" />
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black py-3.5 rounded-xl transition-all active:scale-[0.98]">
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating…
                                </span>
                            ) : "Create Account"}
                        </button>
                    </form>

                    <p className="text-center text-gray-600 text-sm border-t border-gray-800 pt-4">
                        Already have an account?{" "}
                        <button onClick={() => onNav("login")} className="text-blue-400 font-black hover:text-blue-300 transition-colors">Sign in →</button>
                    </p>

                    <button onClick={() => onNav("home")} className="w-full text-gray-700 hover:text-gray-500 text-xs transition-colors py-1">
                        Continue browsing as guest →
                    </button>
                </div>
            </div>
        </div>
    );
}