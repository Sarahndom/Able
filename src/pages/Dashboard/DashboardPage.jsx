import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabase";
import {
    Fingerprint, Lock, Trash2, TrendingUp, TrendingDown,
    Eye, EyeOff, Target, LogOut, Sun, Moon,
    X, ShieldCheck, AlertCircle, CheckCircle2, AlertTriangle,
    User, Mail, Phone, MapPin, Edit2, Save, Package,
    Calendar, CreditCard, ShoppingBag
} from "lucide-react";

// --- SUB-COMPONENTS ---

const DashboardHeader = ({ displayName, initials, email, createdAt, isDark, setIsDark }) => (
    <div className={`rounded-3xl p-6 sm:p-8 mb-8 border relative overflow-hidden ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-white text-2xl sm:text-3xl shadow-xl shadow-blue-600/30 flex-shrink-0">
                {initials}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-black truncate">{displayName}</h1>
                    <span className="bg-blue-600/10 text-blue-400 text-xs font-black px-2.5 py-1 rounded-full border border-blue-600/20">
                        ✓ Verified Member
                    </span>
                </div>
                <p className="text-gray-500 text-sm mt-1">{email}</p>
                <p className="text-gray-600 text-xs mt-1">
                    Member since {createdAt ? new Date(createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : '—'}
                </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center">
                <button onClick={() => setIsDark(!isDark)}
                    className={`p-2.5 rounded-xl border transition-all ${isDark ? 'bg-gray-800 border-gray-700 text-blue-400' : 'bg-gray-100 border-gray-200 text-blue-600'}`}>
                    {isDark ? <Sun size={16} /> : <Moon size={16} />}
                </button>
            </div>
        </div>
    </div>
);

const ProfileTab = ({ isDark, editMode, setEditMode, editForm, setEditForm, profile, user, loadingProfile, savingProfile, saveProfile, handleSignOut }) => (
    <div className={`rounded-3xl border p-6 sm:p-8 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black">Profile Information</h2>
            {!editMode ? (
                <button onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-bold transition-colors">
                    <Edit2 size={14} /> Edit Profile
                </button>
            ) : (
                <div className="flex gap-2">
                    <button onClick={() => { setEditMode(false); setEditForm({ full_name: profile.full_name, phone: profile.phone, address: profile.address }); }}
                        className="text-gray-500 hover:text-white text-sm border border-gray-700 px-3 py-1.5 rounded-xl transition-all">
                        Cancel
                    </button>
                    <button onClick={saveProfile} disabled={savingProfile}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-black px-4 py-1.5 rounded-xl transition-all">
                        {savingProfile ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                        Save
                    </button>
                </div>
            )}
        </div>
        {loadingProfile ? (
            <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                    { label: "Full Name", icon: <User size={14} />, key: "full_name", value: profile?.full_name, editable: true },
                    { label: "Email Address", icon: <Mail size={14} />, value: user?.email, editable: false, note: "Contact support to change your email" },
                    { label: "Phone Number", icon: <Phone size={14} />, key: "phone", value: profile?.phone || "—", editable: true, placeholder: "+1 (555) 000-0000" },
                    { label: "Delivery Address", icon: <MapPin size={14} />, key: "address", value: profile?.address || "—", editable: true, placeholder: "123 Main St, City, Country", span: true },
                ].map(({ label, icon, key, value, editable, note, placeholder, span }) => (
                    <div key={label} className={`${span ? 'sm:col-span-2' : ''} ${isDark ? 'bg-gray-800/60 border-gray-700' : 'bg-gray-50 border-gray-200'} rounded-2xl p-4 border`}>
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            {icon}
                            <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
                        </div>
                        {editMode && editable ? (
                            <input
                                value={editForm[key] || ""}
                                onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))}
                                placeholder={placeholder}
                                className={`w-full bg-transparent text-sm font-semibold outline-none border-b pb-1 transition-colors ${isDark ? 'text-white border-gray-600 focus:border-blue-500' : 'text-gray-900 border-gray-300 focus:border-blue-500'}`}
                            />
                        ) : (
                            <>
                                <p className={`text-sm font-semibold ${(!value || value === "—") ? 'text-gray-500 italic' : ''}`}>
                                    {value || "Not set"}
                                </p>
                                {note && <p className="text-gray-600 text-[10px] mt-1">{note}</p>}
                            </>
                        )}
                    </div>
                ))}
            </div>
        )}
        <div className="mt-8 pt-6 border-t border-gray-800">
            <button onClick={handleSignOut}
                className="flex items-center gap-2 text-gray-500 hover:text-red-400 text-sm font-semibold transition-colors">
                <LogOut size={16} /> Sign Out
            </button>
        </div>
    </div>
);

// --- MAIN PAGE COMPONENT ---

export default function DashboardPage({ user, setUser, onNav, showToast }) {

    const [isDark, setIsDark] = useState(() => localStorage.getItem("app_theme") !== "light");
    const [activeTab, setActiveTab] = useState("profile");

    // Real profile state
    const [profile, setProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editForm, setEditForm] = useState({ full_name: "", phone: "", address: "" });
    const [savingProfile, setSavingProfile] = useState(false);

    // Orders
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    // Security modal
    const [modal, setModal] = useState({ show: false, type: "", step: "verify" });
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isWrong, setIsWrong] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Biometric
    const [isBiometricActive, setIsBiometricActive] = useState(() => localStorage.getItem("bio_enabled") === "true");
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        localStorage.setItem("app_theme", isDark ? "dark" : "light");
    }, [isDark]);

    /* ── Load real profile from Supabase ── */
    useEffect(() => {
        if (!user?.id) { setLoadingProfile(false); return; }
        const loadProfile = async () => {
            setLoadingProfile(true);
            try {
                const { data } = await supabase
                    .from("profiles")
                    .select("full_name, email, phone, address, avatar_url, created_at")
                    .eq("id", user.id)
                    .single();

                const p = {
                    full_name: data?.full_name || user.name || "—",
                    email: user.email,
                    phone: data?.phone || "",
                    address: data?.address || "",
                    avatar_url: data?.avatar_url || null,
                    created_at: data?.created_at || user.memberSince || new Date().toISOString(),
                };
                setProfile(p);
                setEditForm({ full_name: p.full_name, phone: p.phone, address: p.address });
            } catch {
                setProfile({
                    full_name: user.name || "—",
                    email: user.email,
                    phone: user.phone || "",
                    address: user.address || "",
                    created_at: user.memberSince || new Date().toISOString(),
                });
            } finally { setLoadingProfile(false); }
        };
        loadProfile();
    }, [user?.id]);

    /* ── Load real orders ── */
    useEffect(() => {
        if (activeTab !== "orders" || !user?.id) return;
        const loadOrders = async () => {
            setLoadingOrders(true);
            try {
                const { data } = await supabase
                    .from("orders")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false });
                setOrders(data || []);
            } catch { setOrders([]); }
            finally { setLoadingOrders(false); }
        };
        loadOrders();
    }, [activeTab, user?.id]);

    /* ── Save profile edits ── */
    const saveProfile = async () => {
        if (!editForm.full_name.trim()) return showToast("Name cannot be empty.", "error");
        setSavingProfile(true);
        try {
            const { error } = await supabase
                .from("profiles")
                .update({
                    full_name: editForm.full_name.trim(),
                    phone: editForm.phone.trim(),
                    address: editForm.address.trim(),
                })
                .eq("id", user.id);

            if (error) throw error;

            setProfile(prev => ({ ...prev, ...editForm }));
            const updated = { ...user, name: editForm.full_name.trim(), phone: editForm.phone, address: editForm.address };
            setUser(updated);
            localStorage.setItem("able_user", JSON.stringify(updated));
            setEditMode(false);
            showToast("Profile updated successfully!");
        } catch {
            showToast("Failed to save. Please try again.", "error");
        } finally { setSavingProfile(false); }
    };

    /* ── Helpers ── */
    const getStoredPassword = () => {
        try { return String(JSON.parse(localStorage.getItem("able_user") || "{}").pass ?? "").trim(); }
        catch { return ""; }
    };

    const triggerWrong = (msg) => {
        setErrorMessage(msg); setIsWrong(true);
        setTimeout(() => setIsWrong(false), 500);
    };

    /* ── Biometric ── */
    const handleBiometricToggle = async () => {
        if (!window.PublicKeyCredential) return showToast("Hardware biometrics not supported on this device", "error");
        setIsScanning(true);
        try {
            if (!isBiometricActive) {
                const challenge = window.crypto.getRandomValues(new Uint8Array(32));
                const credential = await navigator.credentials.create({
                    publicKey: {
                        challenge,
                        rp: { name: "Able Enterprise" },
                        user: { id: window.crypto.getRandomValues(new Uint8Array(16)), name: user?.email, displayName: user?.name },
                        pubKeyCredParams: [{ alg: -7, type: "public-key" }, { alg: -257, type: "public-key" }],
                        authenticatorSelection: { userVerification: "required" },
                        timeout: 60000,
                    },
                });
                if (credential) {
                    setIsBiometricActive(true);
                    localStorage.setItem("bio_enabled", "true");
                    showToast("Biometric authentication enabled");
                }
            } else {
                setIsBiometricActive(false);
                localStorage.setItem("bio_enabled", "false");
                showToast("Biometric authentication disabled");
            }
        } catch { showToast("Biometric setup failed", "error"); }
        finally { setIsScanning(false); }
    };

    /* ── Password verify step ── */
    const handleVerifyPassword = async () => {
        const input = currentPassword.trim();
        if (!input) return triggerWrong("Please enter your current password.");

        setIsProcessing(true);
        const { error } = await supabase.auth.signInWithPassword({ email: user.email, password: input });
        setIsProcessing(false);

        if (error) return triggerWrong("Incorrect password. Please try again.");

        setErrorMessage(""); setIsWrong(false);
        if (modal.type === "password") {
            setCurrentPassword("");
            setModal(prev => ({ ...prev, step: "new-password" }));
        } else if (modal.type === "delete") {
            handleDeleteAccount();
        }
    };

    /* ── Delete account ── */
    const handleDeleteAccount = async () => {
        setIsProcessing(true);
        try {
            await supabase.from("profiles").update({ deleted: true }).eq("id", user.id);
            await supabase.auth.signOut();
            localStorage.clear();
            showToast("Account deleted.", "error");
            setTimeout(() => window.location.reload(), 1200);
        } catch {
            showToast("Failed to delete account.", "error");
            setIsProcessing(false);
        }
    };

    /* ── Password update ── */
    const handlePasswordUpdate = async () => {
        if (newPassword.length < 6) return triggerWrong("Password must be at least 6 characters.");
        if (newPassword !== confirmPassword) return triggerWrong("Passwords do not match.");

        setIsProcessing(true);
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        setIsProcessing(false);

        if (error) return triggerWrong("Failed to update password. Please try again.");

        const raw = localStorage.getItem("able_user");
        if (raw) { const d = JSON.parse(raw); d.pass = newPassword; localStorage.setItem("able_user", JSON.stringify(d)); }

        setIsSuccess(true);
        showToast("Password updated successfully!");
    };

    /* ── Modal helpers ── */
    const openModal = (type) => {
        setErrorMessage(""); setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
        setShowCurrentPass(false); setShowNewPass(false); setShowConfirmPass(false);
        setIsSuccess(false); setIsWrong(false); setIsProcessing(false);
        setModal({ show: true, type, step: "verify" });
    };
    const closeModal = () => setModal({ show: false, type: "", step: "verify" });

    /* ── Sign out ── */
    const handleSignOut = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem("able_user");
        window.location.reload();
    };

    /* ── Password input component ── */
    const PasswordField = ({ value, onChange, show, onToggle, placeholder }) => (
        <div className="relative">
            <input
                type={show ? "text" : "password"} value={value} onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full bg-transparent border-2 rounded-2xl p-4 pr-12 text-center text-sm font-bold outline-none transition-all
                    ${isWrong ? 'border-red-500' : isDark ? 'border-gray-700 text-white focus:border-blue-500' : 'border-gray-300 text-black focus:border-blue-500'}`}
            />
            <button type="button" onClick={onToggle}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
        </div>
    );

    const displayName = profile?.full_name || user?.name || "User";
    const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    const TABS = [
        { key: "profile", label: "Profile", icon: <User size={14} /> },
        { key: "orders", label: "Orders", icon: <Package size={14} /> },
        { key: "security", label: "Security", icon: <ShieldCheck size={14} /> },
    ];

    return (
        <div className={`min-h-screen transition-all duration-300 ${isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

                <DashboardHeader
                    displayName={displayName} initials={initials} email={user?.email}
                    createdAt={profile?.created_at} isDark={isDark} setIsDark={setIsDark}
                />

                {/* ── TABS ── */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                    {TABS.map(({ key, label, icon }) => (
                        <button key={key} onClick={() => setActiveTab(key)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab === key ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : isDark ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-white text-gray-500 border border-gray-200 hover:text-gray-800'}`}>
                            {icon} {label}
                        </button>
                    ))}
                </div>

                {/* ══ PROFILE TAB ══ */}
                {activeTab === "profile" && (
                    <ProfileTab
                        isDark={isDark} editMode={editMode} setEditMode={setEditMode}
                        editForm={editForm} setEditForm={setEditForm} profile={profile}
                        user={user} loadingProfile={loadingProfile} savingProfile={savingProfile}
                        saveProfile={saveProfile} handleSignOut={handleSignOut}
                    />
                )}

                {/* ══ ORDERS TAB ══ */}
                {activeTab === "orders" && (
                    <div className={`rounded-3xl border p-6 sm:p-8 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                        <h2 className="text-lg font-black mb-6">Order History</h2>
                        {loadingOrders ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-16">
                                <ShoppingBag size={48} className="mx-auto mb-4 text-gray-700" />
                                <h3 className="text-white font-bold mb-2">No orders yet</h3>
                                <p className="text-gray-500 text-sm mb-6">Your orders will appear here once you've made a purchase.</p>
                                <button onClick={() => onNav('shop')}
                                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-2xl transition-all">
                                    Browse Products →
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map(o => (
                                    <div key={o.id} className={`rounded-2xl p-5 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                                        <div className="flex items-center justify-between flex-wrap gap-3">
                                            <div>
                                                <p className="text-blue-400 font-mono font-bold text-sm">{o.id}</p>
                                                <p className="text-gray-500 text-xs mt-1">
                                                    {new Date(o.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-lg text-blue-400">${(o.total || 0).toFixed(2)}</p>
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${o.status === 'Delivered' ? 'text-green-400 bg-green-400/10' :
                                                    o.status === 'Shipped' ? 'text-blue-400 bg-blue-400/10' :
                                                        'text-blue-400 bg-blue-400/10'}`}>
                                                    {o.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ══ SECURITY TAB ══ */}
                {activeTab === "security" && (
                    <div className={`rounded-3xl border p-6 sm:p-8 space-y-4 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                        <h2 className="text-lg font-black mb-2">Security Settings</h2>
                        <div className={`flex items-center justify-between p-4 rounded-2xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-xl ${isScanning ? 'bg-blue-600 animate-pulse' : isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                    <Fingerprint size={18} className={isScanning ? 'text-white' : 'text-blue-500'} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Biometric Authentication</p>
                                    <p className="text-gray-500 text-xs">Face ID / Touch ID</p>
                                </div>
                            </div>
                            <button onClick={handleBiometricToggle}
                                className={`w-12 h-6 rounded-full relative transition-all ${isBiometricActive ? 'bg-blue-600' : 'bg-gray-600'}`}>
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isBiometricActive ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                        <button onClick={() => openModal("password")}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all group ${isDark ? 'bg-gray-800 border-gray-700 hover:border-blue-500' : 'bg-gray-50 border-gray-200 hover:border-blue-400'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-xl transition-all ${isDark ? 'bg-gray-700 group-hover:bg-blue-600' : 'bg-gray-200 group-hover:bg-blue-600'}`}>
                                    <Lock size={16} className="text-blue-500 group-hover:text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold">Change Password</p>
                                    <p className="text-gray-500 text-xs">Update your account password</p>
                                </div>
                            </div>
                            <span className="text-gray-500 group-hover:translate-x-1 transition-transform text-sm">→</span>
                        </button>
                        <button onClick={() => openModal("delete")}
                            className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all text-red-500 group ${isDark ? 'bg-gray-800 border-gray-700 hover:border-red-500/50 hover:bg-red-500/5' : 'bg-gray-50 border-gray-200 hover:border-red-300 hover:bg-red-50'}`}>
                            <div className="p-3 bg-red-500/10 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-all">
                                <Trash2 size={16} />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold">Delete Account</p>
                                <p className="text-gray-500 text-xs">Permanently remove your account and all data</p>
                            </div>
                        </button>
                    </div>
                )}
            </div>

            {/* SECURITY MODAL */}
            <AnimatePresence>
                {modal.show && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1, x: isWrong ? [-8, 8, -8, 8, 0] : 0 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`relative w-full max-w-md p-8 rounded-3xl shadow-2xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}
                        >
                            <button onClick={closeModal} className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>

                            {isSuccess ? (
                                <div className="text-center py-4">
                                    <CheckCircle2 size={64} className="text-green-500 mx-auto mb-5" />
                                    <h2 className="text-xl font-black mb-2">Password Updated!</h2>
                                    <p className="text-gray-500 text-sm mb-6">Your new password is active. Use it next time you sign in.</p>
                                    <button onClick={closeModal} className="w-full py-3.5 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-500 transition-all">
                                        Done
                                    </button>
                                </div>
                            ) : modal.step === "verify" ? (
                                <div className="text-center">
                                    <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4 ${modal.type === 'delete' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                        {modal.type === 'delete' ? <AlertCircle size={28} /> : <ShieldCheck size={28} />}
                                    </div>
                                    <h2 className="text-xl font-black mb-1">
                                        {modal.type === 'password' ? 'Verify Identity' : 'Delete Account'}
                                    </h2>
                                    {modal.type === 'delete' && (
                                        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 my-4 text-left">
                                            <div className="flex gap-3">
                                                <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                                                <p className="text-gray-400 text-xs leading-relaxed">
                                                    This is <strong className="text-red-400">permanent and irreversible</strong>. Your account, all orders, and personal data will be permanently erased.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    <p className="text-gray-500 text-xs mb-5 mt-3">
                                        {modal.type === 'delete' ? 'Enter your password to confirm' : 'Enter your current password to continue'}
                                    </p>
                                    <PasswordField
                                        value={currentPassword} onChange={setCurrentPassword}
                                        show={showCurrentPass} onToggle={() => setShowCurrentPass(s => !s)}
                                        placeholder="Current Password"
                                    />
                                    <div className="h-5 mt-2 mb-4">
                                        {errorMessage && (
                                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-[11px] font-bold">
                                                {errorMessage}
                                            </motion.p>
                                        )}
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={closeModal}
                                            className={`flex-1 py-3 rounded-2xl font-bold text-sm border transition-all ${isDark ? 'border-gray-700 text-gray-400 hover:text-white' : 'border-gray-300 text-gray-500'}`}>
                                            Cancel
                                        </button>
                                        <button onClick={handleVerifyPassword} disabled={isProcessing}
                                            className={`flex-1 py-3 rounded-2xl font-black text-sm text-white transition-all disabled:opacity-50 ${modal.type === 'delete' ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'}`}>
                                            {isProcessing ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying…
                                                </span>
                                            ) : modal.type === 'delete' ? 'Confirm Delete' : 'Continue'}
                                        </button>
                                    </div>
                                </div>
                            ) : modal.step === "new-password" ? (
                                <div className="text-center">
                                    <div className="w-14 h-14 mx-auto rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                                        <Lock size={28} />
                                    </div>
                                    <h2 className="text-xl font-black mb-1">Set New Password</h2>
                                    <p className="text-gray-500 text-xs mb-5">Must be at least 6 characters</p>
                                    <div className="space-y-3 mb-2">
                                        <PasswordField value={newPassword} onChange={setNewPassword} show={showNewPass} onToggle={() => setShowNewPass(s => !s)} placeholder="New Password" />
                                        <PasswordField value={confirmPassword} onChange={setConfirmPassword} show={showConfirmPass} onToggle={() => setShowConfirmPass(s => !s)} placeholder="Confirm New Password" />
                                    </div>
                                    <div className="h-5 mb-5">
                                        {errorMessage && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-[11px] font-bold">{errorMessage}</motion.p>}
                                    </div>
                                    <button onClick={handlePasswordUpdate} disabled={isProcessing}
                                        className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-2xl font-black transition-all">
                                        {isProcessing ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating…
                                            </span>
                                        ) : 'Update Password'}
                                    </button>
                                </div>
                            ) : null}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}