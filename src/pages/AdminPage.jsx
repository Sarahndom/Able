import { useEffect, useState } from "react";
import { PRODUCTS } from "../data/products";
import { supabase } from "../lib/supabase";

import {
    LayoutDashboard, Package, ShoppingBag, Users,
    DollarSign, ShoppingCart, Lock, Eye, EyeOff,
    ShieldCheck, LogOut, BarChart2, AlertCircle
} from "lucide-react";

import Dashboard from "../admin/Dashboard";
import Products from "../admin/Products";
import Orders from "../admin/Orders";
import UsersTab from "../admin/Users";
import Analytics from "../admin/Analytics";

/* ═══════════════════════════════════════════════════
   ADMIN LOGIN GATE — zero credentials in code
   All auth is handled 100% by Supabase + role check
═══════════════════════════════════════════════════ */
function AdminLoginGate({ onUnlock }) {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);

    /* ── On mount: check if there's already a valid admin session ── */
    useEffect(() => {
        const tryRestore = async () => {
            try {
                const { data } = await supabase.auth.getSession();
                if (data?.session?.user) {
                    const ok = await checkAdminRole(data.session.user.id);
                    if (ok) { onUnlock(); return; }
                    // Has session but not admin → sign out silently
                    await supabase.auth.signOut();
                }
            } catch { /* ignore — fall through to login form */ }
            setCheckingSession(false);
        };
        tryRestore();
    }, []);

    /* ── Role check: reads from public.users table ── */
    const checkAdminRole = async (userId) => {
        const { data, error } = await supabase
            .from("users")
            .select("role")
            .eq("id", userId)
            .single();

        return !error && data?.role === "admin";
    };

    /* ── Login handler ── */
    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Step 1: Authenticate with Supabase
            const { data, error: authErr } = await supabase.auth.signInWithPassword({
                email: email.trim().toLowerCase(),
                password: pass,
            });

            if (authErr || !data?.user) {
                setError("Incorrect email or password. Please try again.");
                return;
            }

            // Step 2: Verify admin role in public.users table
            const isAdmin = await checkAdminRole(data.user.id);

            if (!isAdmin) {
                // Not admin — sign them back out immediately
                await supabase.auth.signOut();
                setError("This account does not have administrator privileges.");
                return;
            }

            // Step 3: Grant access
            onUnlock();

        } catch (err) {
            if (err?.message?.includes("fetch") || err?.message?.includes("network")) {
                setError("Network error. Please check your connection and try again.");
            } else {
                setError("Something went wrong. Please try again.");
            }
            console.error("Admin login error:", err);
        } finally {
            setLoading(false);
        }
    };

    /* ── Checking existing session ── */
    if (checkingSession) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 text-sm">Verifying session…</p>
                </div>
            </div>
        );
    }

    /* ── Login form ── */
    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* Branding */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 font-black text-white text-2xl shadow-2xl shadow-blue-600/30">
                        AE
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <ShieldCheck size={20} className="text-blue-400" />
                        <h1 className="text-2xl font-black text-white">Admin Access</h1>
                    </div>
                    <p className="text-gray-400 text-sm font-semibold">Able Enterprise</p>
                    <p className="text-gray-600 text-xs mt-1">Restricted area — authorised personnel only</p>
                </div>

                <form
                    onSubmit={handleLogin}
                    className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-5 shadow-2xl"
                >
                    {/* Error message */}
                    {error && (
                        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                            <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-red-400 text-xs leading-relaxed">{error}</p>
                        </div>
                    )}

                    {/* Email */}
                    <div>
                        <label className="text-gray-400 text-xs block mb-1.5 font-semibold uppercase tracking-wide">
                            Admin Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => { setEmail(e.target.value); setError(""); }}
                            required
                            autoComplete="username"
                            placeholder="Enter your admin email"
                            className="w-full bg-black text-white px-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-blue-500 text-sm transition-colors placeholder-gray-700"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-gray-400 text-xs block mb-1.5 font-semibold uppercase tracking-wide">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPass ? "text" : "password"}
                                value={pass}
                                onChange={e => { setPass(e.target.value); setError(""); }}
                                required
                                autoComplete="current-password"
                                placeholder="••••••••"
                                className="w-full bg-black text-white px-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-blue-500 text-sm pr-11 transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(s => !s)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors"
                                tabIndex={-1}
                            >
                                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Verifying…
                            </>
                        ) : (
                            <>
                                <Lock size={16} />
                                Enter Admin Panel
                            </>
                        )}
                    </button>

                    {/* Security note */}
                    <p className="text-center text-gray-700 text-xs leading-relaxed">
                        🔒 Your credentials are verified securely via Supabase.<br />
                        No passwords are stored in this application's code.
                    </p>
                </form>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   MAIN ADMIN PAGE
═══════════════════════════════════════════════════ */
function AdminPage({ onNav }) {
    const [unlocked, setUnlocked] = useState(false);
    const [tab, setTab] = useState("overview");
    const [toast, setToast] = useState(null);

    // Kept for backward compatibility
    const [prods, setProds] = useState(PRODUCTS);
    const [orders, setOrders] = useState([
        { id: "ORD-7A3F9", customer: "John Smith", email: "john@email.com", total: 1248, status: "Delivered", date: "2025-12-15", items: 2 },
        { id: "ORD-2B8D1", customer: "Sarah Johnson", email: "sarah@email.com", total: 349, status: "Shipped", date: "2026-01-03", items: 1 },
        { id: "ORD-5C6E2", customer: "Mike Chen", email: "mike@email.com", total: 699, status: "Processing", date: "2026-01-18", items: 1 },
        { id: "ORD-9D4H7", customer: "Emily Davis", email: "emily@email.com", total: 249, status: "Pending", date: "2026-01-20", items: 1 },
        { id: "ORD-3E1K5", customer: "Alex Wilson", email: "alex@email.com", total: 1099, status: "Paid", date: "2026-01-22", items: 1 },
    ]);

    const [confirmDelete, setConfirmDelete] = useState(null);
    const [editingOrder, setEditingOrder] = useState(null);

    const revenue = orders.reduce((sum, o) => sum + o.total, 0);
    const pending = orders.filter(o => o.status === "Pending").length;
    const inStock = prods.filter(p => p.stock > 0).length;

    const tabs = [
        { key: "overview", label: "Overview", icon: <LayoutDashboard size={16} /> },
        { key: "analytics", label: "Analytics", icon: <BarChart2 size={16} /> },
        { key: "products", label: "Products", icon: <Package size={16} /> },
        { key: "orders", label: "Orders", icon: <ShoppingBag size={16} /> },
        { key: "users", label: "Users", icon: <Users size={16} /> },
    ];

    const statusColor = (s) => {
        switch (s) {
            case 'Delivered': return 'text-green-400 bg-green-400/10';
            case 'Shipped': return 'text-blue-400 bg-blue-400/10';
            case 'Processing': return 'text-blue-400 bg-blue-400/10';
            case 'Pending': return 'text-orange-400 bg-orange-400/10';
            case 'Paid': return 'text-purple-400 bg-purple-400/10';
            default: return 'text-gray-400 bg-gray-400/10';
        }
    };

    const mockUsers = [
        { name: "John Smith", email: "john@email.com", orders: 3, spent: 1248, joined: "Dec 2025" },
        { name: "Sarah Johnson", email: "sarah@email.com", orders: 1, spent: 349, joined: "Jan 2026" },
        { name: "Mike Chen", email: "mike@email.com", orders: 2, spent: 699, joined: "Jan 2026" },
        { name: "Emily Davis", email: "emily@email.com", orders: 1, spent: 249, joined: "Jan 2026" },
        { name: "Alex Wilson", email: "alex@email.com", orders: 1, spent: 1099, joined: "Jan 2026" },
    ];

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    /* ── Lock handler ── */
    const handleLock = async () => {
        await supabase.auth.signOut();
        setUnlocked(false);
        setTab("overview");
    };

    if (!unlocked) {
        return <AdminLoginGate onUnlock={() => setUnlocked(true)} />;
    }

    return (
        <div className="min-h-screen bg-gray-950">

            {/* Toast notification */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-2xl text-sm font-bold shadow-2xl transition-all ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                    }`}>
                    {toast.msg}
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-base shadow-lg shadow-blue-600/20">
                                AE
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-black text-white leading-none">
                                    Admin Dashboard
                                </h1>
                                <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mt-0.5">
                                    Able Enterprise
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="bg-blue-600/20 text-blue-400 text-xs font-black px-3 py-1.5 rounded-full border border-blue-600/30">
                            ⚡ ADMIN MODE
                        </span>
                        <button
                            onClick={() => onNav('home')}
                            className="text-gray-500 hover:text-white text-sm border border-gray-700 hover:border-gray-500 px-4 py-2 rounded-xl transition-all"
                        >
                            ← Back to Store
                        </button>
                        <button
                            onClick={handleLock}
                            className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm border border-red-500/30 hover:border-red-500/60 px-3 py-2 rounded-xl transition-all"
                        >
                            <LogOut size={14} /> Lock
                        </button>
                    </div>
                </div>

                {/* TABS */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {tabs.map(({ key, label, icon }) => (
                        <button
                            key={key}
                            onClick={() => setTab(key)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${tab === key
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                                }`}
                        >
                            {icon} {label}
                        </button>
                    ))}
                </div>

                {/* TAB CONTENT */}
                {tab === "overview" && <Dashboard onTabChange={setTab} />}
                {tab === "analytics" && <Analytics />}
                {tab === "products" && <Products showToast={showToast} />}
                {tab === "orders" && <Orders showToast={showToast} />}
                {tab === "users" && <UsersTab showToast={showToast} />}
            </div>
        </div>
    );
}

export default AdminPage;