// pages/login/LoginPage.jsx
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { User } from "lucide-react";
import LoginHeader, { GoogleIcon } from "./LoginHeader";
import LoginForm from "./LoginForm";

export default function LoginPage({ setUser, onNav, showToast }) {
    const [email, setEmail]         = useState("");
    const [pass, setPass]           = useState("");
    const [show, setShow]           = useState(false);
    const [loading, setLoading]     = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [guestLoading, setGuestLoading]   = useState(false);
    const [fieldError, setFieldError] = useState("");

    /* ── Google OAuth ── */
    const loginWithGoogle = async () => {
        setGoogleLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: window.location.origin },
        });
        if (error) {
            showToast(error.message, "error");
            setGoogleLoading(false);
        }
        // On success Supabase redirects back → App.jsx SIGNED_IN event handles the rest
    };

    /* ── Guest browse ── */
    const loginAsGuest = () => {
        setGuestLoading(true);
        setTimeout(() => {
            setGuestLoading(false);
            onNav("home");
            showToast("Browsing as guest. Sign up for cart & checkout access.");
        }, 400);
    };

    /* ── Email / password login ── */
    const login = async (e) => {
        e.preventDefault();
        setFieldError("");
        setLoading(true);

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: email.trim().toLowerCase(),
                password: pass,
            });

            if (authError) {
                if (authError.message.includes("Invalid login credentials") || authError.message.includes("invalid_credentials")) {
                    setFieldError("Incorrect email or password. Please try again.");
                } else if (authError.message.includes("Email not confirmed")) {
                    setFieldError("Please verify your email first. Check your inbox for a confirmation link.");
                } else {
                    setFieldError(authError.message);
                }
                return;
            }

            if (data?.user) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("full_name, pass, deleted, avatar_url, phone, address, created_at")
                    .eq("id", data.user.id)
                    .single();

                if (profile?.deleted) {
                    await supabase.auth.signOut();
                    setFieldError("This account has been deleted. Please create a new one.");
                    return;
                }

                const userData = {
                    id:          data.user.id,
                    name:        profile?.full_name || data.user.user_metadata?.full_name || email.split("@")[0],
                    email:       data.user.email,
                    role:        "user",
                    avatarUrl:   profile?.avatar_url || null,
                    phone:       profile?.phone   || "",
                    address:     profile?.address || "",
                    memberSince: data.user.created_at,
                    pass:        profile?.pass || pass,
                };

                localStorage.setItem("able_user", JSON.stringify(userData));
                setUser(userData);
                showToast(`Welcome back, ${userData.name.split(" ")[0]}! 👋`);
                onNav("dashboard");
            }
        } catch (err) {
            if (err?.message?.includes("fetch") || err?.message?.includes("Failed to fetch")) {
                setFieldError("Cannot connect. Check your internet connection, or add http://localhost:5173 to your Supabase URL config.");
            } else {
                setFieldError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">

                <LoginHeader />

                <form onSubmit={login} className="bg-gray-900 border border-gray-800 rounded-2xl p-7 sm:p-8 space-y-4 shadow-2xl">

                    {/* ── Google button ── */}
                    <button
                        type="button"
                        onClick={loginWithGoogle}
                        disabled={googleLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 font-bold py-3 rounded-xl border border-gray-200 transition-all disabled:opacity-60"
                    >
                        {googleLoading
                            ? <span className="w-5 h-5 border-2 border-gray-400/30 border-t-gray-500 rounded-full animate-spin" />
                            : <GoogleIcon />}
                        Continue with Google
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-800" />
                        <span className="text-gray-600 text-xs font-bold uppercase">or</span>
                        <div className="flex-1 h-px bg-gray-800" />
                    </div>

                    {/* Email + password fields */}
                    <LoginForm
                        email={email} setEmail={setEmail}
                        pass={pass} setPass={setPass}
                        show={show} setShow={setShow}
                        fieldError={fieldError} setFieldError={setFieldError}
                        onNav={onNav}
                    />

                    {/* Sign In button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black py-3.5 rounded-xl text-base transition-all active:scale-[0.98]"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Signing In…
                            </span>
                        ) : "Sign In"}
                    </button>

                    {/* Divider before guest */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-800" />
                        <span className="text-gray-700 text-xs font-bold uppercase">or</span>
                        <div className="flex-1 h-px bg-gray-800" />
                    </div>

                    {/* Guest button */}
                    <button
                        type="button"
                        onClick={loginAsGuest}
                        disabled={guestLoading}
                        className="w-full flex items-center justify-center gap-2 border border-gray-800 hover:border-gray-600 text-gray-500 hover:text-gray-300 font-semibold py-3 rounded-xl text-sm transition-all disabled:opacity-50"
                    >
                        {guestLoading
                            ? <span className="w-4 h-4 border-2 border-gray-600/30 border-t-gray-500 rounded-full animate-spin" />
                            : <><User size={15} /> Browse as Guest</>}
                    </button>
                    <p className="text-gray-700 text-center text-[11px] -mt-1 leading-relaxed">
                        Guests can browse &amp; add to cart. Sign in to view cart &amp; checkout.
                    </p>

                    {/* Sign up link */}
                    <p className="text-center text-gray-600 text-sm border-t border-gray-800 pt-4">
                        No account?{" "}
                        <button type="button" onClick={() => onNav("signup")} className="text-blue-400 font-black hover:text-blue-300 transition-colors">
                            Create one free →
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}