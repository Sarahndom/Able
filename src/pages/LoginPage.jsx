import { useState } from "react";
import { supabase } from "../lib/supabase"; // ✅ ADDED

function LoginPage({ setUser, onNav, showToast }) {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [show, setShow] = useState(false);

    const login = async (e) => {
        e.preventDefault();

        // ✅ ADMIN (keep your logic)
        if (email === 'admin@electrostore.com' && pass === 'admin123') {
            const adminUser = { name: 'Admin User', email, role: 'admin' };
            setUser(adminUser);
            localStorage.setItem("able_user", JSON.stringify(adminUser));
            showToast('Welcome, Admin!');
            onNav('admin');
            return;
        }

        // ✅ SUPABASE LOGIN
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password: pass,
        });

        if (error) return showToast(error.message, 'error');

        const userData = {
            name: email.split('@')[0],
            email,
            role: 'user'
        };

        // ✅ SAVE SESSION LOCALLY
        // localStorage.setItem("able_user", JSON.stringify(userData));

        setUser(userData);
        showToast('Signed in successfully!');
        onNav('dashboard');
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#004792] rounded-2xl flex items-center justify-center mx-auto mb-4 font-black text-white text-3xl">AE</div>
                    <h1 className="text-3xl font-black text-white">Welcome Back</h1>
                    <p className="text-gray-500 mt-1">Sign in to Able Enterprises</p>
                </div>

                <form onSubmit={login} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-5 shadow-2xl">
                    <div>
                        <label className="text-gray-400 text-sm block mb-1.5">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="w-full bg-black text-white px-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-[#004792] text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-gray-400 text-sm block mb-1.5">Password</label>
                        <div className="relative">
                            <input
                                type={show ? 'text' : 'password'}
                                value={pass}
                                onChange={e => setPass(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full bg-black text-white px-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-[#004792] text-sm pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShow(!show)}
                                className="absolute right-3 top-3 text-gray-500 hover:text-gray-300 text-sm"
                            >
                                {show ? '🙈' : '👁'}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between text-sm items-center">
                        <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                            <input type="checkbox" className="accent-[#004792]" /> Remember me
                        </label>
                        <button
                            type="button"
                            onClick={() => onNav('forgot')}
                            className="text-[#004792] hover:underline text-xs"
                        >
                            Forgot password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#004792] hover:bg-[#005bc0] text-white font-bold py-3.5 rounded-xl text-lg transition-all"
                    >
                        Sign In
                    </button>

                    <p className="text-center text-gray-500 text-sm">
                        No account?{" "}
                        <button
                            type="button"
                            onClick={() => onNav('signup')}
                            className="text-[#004792] font-bold hover:underline"
                        >
                            Sign up free
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;