import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminPage from "./AdminPage";
import {
    Fingerprint, Lock, Trash2, TrendingUp, TrendingDown,
    Eye, EyeOff, MousePointer2, Target, LogOut, Sun, Moon,
    X, ShieldCheck, AlertCircle, CheckCircle2
} from "lucide-react";

export default function DashboardPage({ user, onNav, showToast }) {

    // ✅ ADMIN REDIRECT
    if (user?.role === 'admin') {
        return <AdminPage onNav={onNav} />;
    }

    const [isDark, setIsDark] = useState(() => localStorage.getItem("app_theme") !== "light");
    const [isBiometricActive, setIsBiometricActive] = useState(() => localStorage.getItem("bio_enabled") === "true");
    const [isScanning, setIsScanning] = useState(false);

    const [modal, setModal] = useState({ show: false, type: "", step: "verify" });
    const [passwordInput, setPasswordInput] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isWrong, setIsWrong] = useState(false);



    useEffect(() => {
        localStorage.setItem("app_theme", isDark ? "dark" : "light");
    }, [isDark]);

    const [metrics] = useState({ spend: 1240.50, impressions: 45200, clicks: 1120, conversions: 84 });

    const handleBiometricToggle = async () => {
        if (!window.PublicKeyCredential) return showToast("Hardware not supported", "error");
        setIsScanning(true);
        try {
            if (!isBiometricActive) {
                const challenge = window.crypto.getRandomValues(new Uint8Array(32));
                const credential = await navigator.credentials.create({
                    publicKey: {
                        challenge,
                        rp: { name: "Able Enterprises" },
                        user: { id: window.crypto.getRandomValues(new Uint8Array(16)), name: user?.email || "user", displayName: user?.name || "User" },
                        pubKeyCredParams: [{ alg: -7, type: "public-key" }],
                        authenticatorSelection: { userVerification: "required" },
                        timeout: 60000,
                    },
                });
                if (credential) {
                    setIsBiometricActive(true);
                    localStorage.setItem("bio_enabled", "true");
                    showToast("Biometric Shield Activated");
                }
            } else {
                setIsBiometricActive(false);
                localStorage.setItem("bio_enabled", "false");
                showToast("Biometric Shield Disabled");
            }
        } catch (err) { showToast("Auth Failed", "error"); } finally { setIsScanning(false); }
    };

    const handleSecuritySubmit = () => {
        const rawData = localStorage.getItem("able_user");

        if (!rawData) {
            setErrorMessage("Error: No user session found. Please re-login.");
            setIsWrong(true);
            return;
        }

        const storedData = JSON.parse(rawData);

        // ✅ FIXED PASSWORD LOGIC ONLY
        const actualAccountPassword = storedData.pass ?? storedData.password ?? "";
        const input = String(passwordInput).trim();
        const actual = String(actualAccountPassword).trim();

        console.log("System Check - Input:", input, "Actual:", actual);

        if (
            input === actual ||
            (storedData.email === 'admin@electrostore.com' && input === 'admin123')
        ) {
            setIsWrong(false);
            setErrorMessage("");
            setIsSuccess(true);

            if (modal.type === "delete") {
                showToast("Account termination initiated", "error");
                setTimeout(() => handleSignOut(), 3000);
            } else {
                showToast("Identity Verified Successfully");
            }
        } else {
            setIsWrong(true);
            setErrorMessage("Authentication Failed: Password does not match our records.");
            setTimeout(() => setIsWrong(false), 500);
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem("able_user");
        window.location.reload();
    };

    const openModal = (type) => {
        setErrorMessage("");
        setPasswordInput("");
        setShowPass(false);
        setIsSuccess(false);
        setModal({ show: true, type, step: "verify" });
    };


    return (
        <div className={`min-h-screen transition-all duration-300 ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="max-w-7xl mx-auto px-6 py-12">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Console_Overview</h1>
                        <p className="text-gray-500 text-sm mt-2 font-mono uppercase tracking-widest">Advertiser_ID: <span className="text-[#0066FF]">482-991-0047</span></p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsDark(!isDark)} className={`p-3 rounded-2xl border transition-all ${isDark ? 'bg-gray-900 border-gray-800 text-yellow-400' : 'bg-white border-gray-200 text-[#0066FF] shadow-sm'}`}>
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <div className={`flex items-center gap-4 p-2 pr-6 rounded-full border ${isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                            <div className="w-12 h-12 bg-[#0066FF] rounded-full flex items-center justify-center font-black text-white shadow-lg shadow-[#0066FF]/20 text-xl uppercase">
                                {user?.name?.[0] || 'S'}
                            </div>
                            <div className={isDark ? "text-white" : "text-black"}>
                                <p className="text-sm font-bold leading-none">{user?.name || "sarahndom620"}</p>
                                <p className="text-[#0066FF] text-[10px] font-black uppercase tracking-widest mt-1">Verified Merchant</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* SECURE_BOX */}
                    <div className="space-y-6">
                        <div className={`border rounded-[32px] p-8 backdrop-blur-md ${isDark ? 'bg-gray-900/40 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                            <div className="text-center mb-8">
                                <h2 className="text-xl font-black italic tracking-[0.2em] uppercase">SECURE<span className="text-[#0066FF]">_BOX</span></h2>
                                <p className="text-[10px] text-gray-500 uppercase font-bold mt-1 tracking-widest">Global Security Node</p>
                            </div>

                            <div className="space-y-3">
                                <div className={`flex items-center justify-between p-4 rounded-2xl border ${isDark ? 'bg-black/40 border-gray-800/50' : 'bg-gray-50 border-gray-200'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl transition-all ${isScanning ? 'bg-[#0066FF] animate-pulse' : 'bg-gray-800'}`}>
                                            <Fingerprint size={20} className={isScanning ? 'text-white' : 'text-[#0066FF]'} />
                                        </div>
                                        <p className="text-xs font-bold uppercase tracking-tight">Biometric Shield</p>
                                    </div>
                                    <button onClick={handleBiometricToggle} className={`w-12 h-6 rounded-full relative transition-all ${isBiometricActive ? 'bg-[#0066FF]' : 'bg-gray-400'}`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isBiometricActive ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>

                                <button onClick={() => openModal("password")} className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all group ${isDark ? 'bg-black/40 border-gray-800/50 hover:border-[#0066FF]' : 'bg-gray-50 border-gray-200 hover:border-[#0066FF]'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-gray-800 rounded-xl group-hover:bg-[#0066FF] transition-all"><Lock size={20} className="text-[#0066FF] group-hover:text-white" /></div>
                                        <span className="text-xs font-bold uppercase">Change Password</span>
                                    </div>
                                    <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                                </button>

                                <button onClick={() => openModal("delete")} className="w-full flex items-center gap-4 p-5 rounded-2xl transition-all hover:bg-red-500/5 text-red-500 group">
                                    <div className="p-3 bg-red-500/10 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-all"><Trash2 size={20} /></div>
                                    <span className="text-xs font-bold uppercase">Delete Account</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ANALYTICS */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Spend', val: `$${metrics.spend}`, up: true, pct: '12%', icon: <TrendingUp size={14} /> },
                                { label: 'Impressions', val: '45.2K', up: true, pct: '5.4%', icon: <Eye size={14} /> },
                                { label: 'Clicks', val: '1,120', up: false, pct: '2%', icon: <TrendingDown size={14} /> },
                                { label: 'Conversions', val: '84', up: true, pct: '10%', icon: <Target size={14} /> }
                            ].map((m, i) => (
                                <div key={i} className={`p-5 rounded-[24px] border ${isDark ? 'bg-gray-900/40 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">{m.label}</p>
                                    <h4 className="text-xl font-black mt-1 leading-none">{m.val}</h4>
                                    <div className={`flex items-center gap-1 text-[10px] font-bold mt-3 ${m.up ? 'text-green-500' : 'text-red-500'}`}>
                                        {m.icon} {m.up ? '+' : '-'}{m.pct}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={`border rounded-[32px] p-8 ${isDark ? 'bg-gray-900/40 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-sm font-black uppercase tracking-widest leading-none">Global_Behavior_Analytics</h3>
                                <div className="flex gap-2 items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                                    <span className="text-[10px] font-bold uppercase text-green-500 tracking-tighter">Live_Tracking</span>
                                </div>
                            </div>

                            <div className={`aspect-[21/9] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden ${isDark ? 'bg-black/40 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#0066FF 1px, transparent 1px), linear-gradient(90deg, #0066FF 1px, transparent 1px)', backgroundSize: '25px 25px' }}></div>
                                <div className="w-16 h-16 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin relative z-10"></div>
                                <p className="text-[10px] font-black uppercase text-[#0066FF] mt-4 tracking-[0.3em] relative z-10">Compiling_Live_Data...</p>
                            </div>
                        </div>

                        <button onClick={handleSignOut} className="w-full py-5 bg-[#0066FF]/10 border border-[#0066FF]/20 text-[#0066FF] font-black uppercase tracking-[0.4em] rounded-[24px] hover:bg-[#0066FF] hover:text-white transition-all flex items-center justify-center gap-3">
                            <LogOut size={20} />
                            Sign Out Account
                        </button>
                    </div>
                </div>
            </div>

            {/* --- SECURITY MODAL OVERLAY --- */}
            <AnimatePresence>
                {modal.show && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                x: isWrong ? [-12, 12, -12, 12, 0] : 0 // SHAKE ANIMATION
                            }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className={`relative w-full max-w-md p-10 rounded-[40px] shadow-2xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white text-black'}`}
                        >
                            <button onClick={() => setModal({ show: false })} className="absolute top-8 right-8 text-gray-400 hover:text-[#0066FF] transition-colors"><X size={24} /></button>

                            {!isSuccess ? (
                                <div className="text-center">
                                    <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${modal.type === 'delete' ? 'bg-red-500/10 text-red-500' : 'bg-[#0066FF]/10 text-[#0066FF]'}`}>
                                        {modal.type === 'delete' ? <AlertCircle size={40} /> : <ShieldCheck size={40} />}
                                    </div>

                                    <h2 className="text-2xl font-black uppercase italic mb-2 tracking-tighter">{modal.type === 'password' ? 'Identity Verification' : 'Account Termination'}</h2>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-10 opacity-60">Handshake Authorization Required</p>

                                    <div className="relative mb-2">
                                        <input
                                            type={showPass ? "text" : "password"}
                                            value={passwordInput}
                                            onChange={(e) => setPasswordInput(e.target.value)}
                                            placeholder="Enter Current Password"
                                            className={`w-full bg-transparent border-2 rounded-2xl p-4 pr-12 text-center text-lg font-bold outline-none transition-all 
                                                ${isWrong
                                                    ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                                                    : isDark ? 'border-gray-700 text-white focus:border-[#0066FF]' : 'border-gray-300 text-black focus:border-[#0066FF]'}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPass(!showPass)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#0066FF] transition-colors"
                                        >
                                            {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>

                                    <div className="h-6 mb-8">
                                        {errorMessage && (
                                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-[10px] font-black uppercase tracking-widest">
                                                {errorMessage}
                                            </motion.p>
                                        )}
                                    </div>

                                    <button onClick={handleSecuritySubmit} className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] shadow-xl transition-all ${modal.type === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-[#0066FF] hover:bg-[#0052cc]'} text-white`}>
                                        Authorize Node
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <CheckCircle2 size={100} className="text-green-500 mx-auto mb-8" />
                                    <h2 className="text-3xl font-black uppercase italic mb-4">Auth Success</h2>
                                    <p className="text-gray-500 text-sm mb-10 leading-relaxed">Identity confirmed. Secure handshake complete with Able Enterprises Global Cluster.</p>
                                    <button onClick={() => setModal({ show: false })} className="w-full py-5 bg-[#0066FF] text-white rounded-2xl font-black uppercase tracking-widest transition-all hover:opacity-90">Return to Console</button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}