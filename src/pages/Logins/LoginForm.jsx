// pages/login/LoginForm.jsx
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export default function LoginForm({
    email, setEmail, pass, setPass, show, setShow,
    fieldError, setFieldError, onNav
}) {
    return (
        <>
            {fieldError && (
                <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-3.5">
                    <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-red-400 text-xs leading-relaxed">{fieldError}</p>
                        {(fieldError.includes("Incorrect") || fieldError.includes("password")) && (
                            <button
                                type="button"
                                onClick={() => onNav("forgot")}
                                className="text-blue-400 text-xs mt-1 hover:underline"
                            >
                                Forgot your password?
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div>
                <label className="text-gray-400 text-xs block mb-1.5 font-semibold uppercase tracking-wide">
                    Email Address
                </label>
                <input
                    type="email" value={email}
                    onChange={e => { setEmail(e.target.value); setFieldError(""); }}
                    placeholder="you@example.com" required autoComplete="email"
                    className="w-full bg-black text-white px-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-blue-500 text-sm transition-colors placeholder-gray-700"
                />
            </div>

            <div>
                <div className="flex items-center justify-between mb-1.5">
                    <label className="text-gray-400 text-xs font-semibold uppercase tracking-wide">Password</label>
                    <button type="button" onClick={() => onNav("forgot")} className="text-blue-400 hover:text-blue-300 text-xs transition-colors font-semibold">
                        Forgot password?
                    </button>
                </div>
                <div className="relative">
                    <input
                        type={show ? "text" : "password"} value={pass}
                        onChange={e => { setPass(e.target.value); setFieldError(""); }}
                        placeholder="••••••••" required autoComplete="current-password"
                        className="w-full bg-black text-white px-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-blue-500 text-sm pr-11 transition-colors"
                    />
                    <button type="button" onClick={() => setShow(s => !s)} tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors">
                        {show ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>
        </>
    );
}