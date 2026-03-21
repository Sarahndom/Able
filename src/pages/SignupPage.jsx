import { useState } from "react";
import { supabase } from "../lib/supabase";

function SignupPage({ setUser, onNav, showToast }) {
    const [f, setF] = useState({
        name: "",
        email: "",
        pass: "",
        confirm: ""
    });

    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const submit = async (e) => {
        e.preventDefault();

        if (f.pass !== f.confirm)
            return showToast("Passwords do not match", "error");

        if (f.pass.length < 6)
            return showToast("Password must be at least 6 characters", "error");

        setLoading(true);

        // ✅ SIGN UP USER
        const { data, error } = await supabase.auth.signUp({
            email: f.email,
            password: f.pass,
        });

        if (error) {
            setLoading(false);
            return showToast(error.message, "error");
        }

        // ✅ INSERT PROFILE (SAFE NOW)
        if (data?.user) {
            const { error: profileError } = await supabase
                .from("profiles")
                .insert({
                    id: data.user.id,
                    email: data.user.email,
                    full_name: f.name
                });

            if (profileError) {
                console.error("Profile error:", profileError);
            }
        }

        setLoading(false);

        showToast("Account created! Check your email 📩");

        onNav("login");
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">

                {/* HEADER */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#0066FF] rounded-2xl flex items-center justify-center mx-auto mb-4 font-black text-white text-3xl">
                        AE
                    </div>
                    <h1 className="text-3xl font-black text-white">Create Account</h1>
                    <p className="text-gray-500 mt-1">Join Able Enterprises</p>
                </div>

                {/* FORM */}
                <form
                    onSubmit={submit}
                    className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-5 shadow-2xl"
                >
                    <input
                        type="text"
                        placeholder="Full Name"
                        required
                        value={f.name}
                        onChange={(e) => setF({ ...f, name: e.target.value })}
                        className="w-full bg-black text-white px-4 py-3 rounded-xl border border-gray-800 focus:border-[#0066FF]"
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        required
                        value={f.email}
                        onChange={(e) => setF({ ...f, email: e.target.value })}
                        className="w-full bg-black text-white px-4 py-3 rounded-xl border border-gray-800 focus:border-[#0066FF]"
                    />

                    <div className="relative">
                        <input
                            type={showPass ? "text" : "password"}
                            placeholder="Password"
                            required
                            value={f.pass}
                            onChange={(e) => setF({ ...f, pass: e.target.value })}
                            className="w-full bg-black text-white px-4 py-3 rounded-xl border border-gray-800 focus:border-[#0066FF]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-3 top-3 text-gray-500"
                        >
                            {showPass ? "🙈" : "👁"}
                        </button>
                    </div>

                    <input
                        type={showPass ? "text" : "password"}
                        placeholder="Confirm Password"
                        required
                        value={f.confirm}
                        onChange={(e) => setF({ ...f, confirm: e.target.value })}
                        className="w-full bg-black text-white px-4 py-3 rounded-xl border border-gray-800 focus:border-[#0066FF]"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold py-3.5 rounded-xl"
                    >
                        {loading ? "Creating..." : "Create Account"}
                    </button>

                    <p className="text-center text-gray-500 text-sm">
                        Already have an account?{" "}
                        <button
                            type="button"
                            onClick={() => onNav("login")}
                            className="text-[#0066FF] font-bold"
                        >
                            Sign in
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default SignupPage;