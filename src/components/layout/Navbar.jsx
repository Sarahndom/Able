import { useState } from "react";
import { ShoppingCart, User, LogOut, ShieldCheck, Menu, X, Search } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function Navbar({ user, onNav, onLogout, showToast }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [q, setQ]               = useState("");
    const { totalItems }          = useCart();   // live badge — guests included

    const isGuest = !user;
    const isAdmin = user?.role === "admin" || user?.email === "admin@electrostore.com";

    const go = (page) => { setMenuOpen(false); onNav(page); };

    const handleSearch = (e) => {
        e.preventDefault();
        if (q.trim()) { onNav("shop", null, { q: q.trim() }); setQ(""); setMenuOpen(false); }
    };

    // Guests see badge + icon but are redirected to login on click
    const handleCart = () => {
        if (isGuest) {
            showToast?.("Sign in to view your cart", "error");
            go("login");
        } else {
            go("cart");
        }
    };

    return (
        <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 shadow-lg shadow-black/20">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-3">

                {/* ── Logo ── */}
                <button onClick={() => go("home")} className="flex items-center gap-2 flex-shrink-0 group">
                    <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-lg shadow-blue-600/30 group-hover:bg-blue-500 transition-colors">
                        AE
                    </div>
                    <div className="hidden sm:block leading-tight">
                        <span className="font-black text-base text-white">Able</span>
                        <span className="font-black text-base text-blue-400">Enterprise</span>
                    </div>
                </button>

                {/* ── Search (desktop) ── */}
                <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-4">
                    <div className="flex w-full rounded-xl overflow-hidden border border-gray-700 focus-within:border-blue-500 transition-colors">
                        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search products…"
                            className="flex-1 bg-gray-800 text-white px-4 py-2 text-sm outline-none placeholder-gray-600" />
                        <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-4 text-white transition-colors flex items-center">
                            <Search size={16} />
                        </button>
                    </div>
                </form>

                {/* ── Right actions ── */}
                <div className="flex items-center gap-1 sm:gap-2 ml-auto">

                    {/* ══ CART — always visible, badge shows for guests too ══ */}
                    <button
                        onClick={handleCart}
                        className="relative p-2.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl transition-all group"
                        aria-label={`Cart ${totalItems > 0 ? `(${totalItems})` : ""}`}
                    >
                        <ShoppingCart size={22} className="transition-transform group-hover:scale-110" />
                        {totalItems > 0 && (
                            <span
                                key={totalItems}
                                className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-blue-600 text-white text-[11px] font-black rounded-full flex items-center justify-center px-1 shadow-lg shadow-blue-600/40"
                                style={{ animation: "badgePop 0.25s ease-out" }}
                            >
                                {totalItems > 99 ? "99+" : totalItems}
                            </span>
                        )}
                    </button>

                    {/* ── Guest: sign in / sign up ── */}
                    {isGuest ? (
                        <div className="hidden sm:flex items-center gap-2">
                            <button onClick={() => go("login")} className="text-gray-400 hover:text-white text-sm font-semibold px-3 py-2 rounded-xl hover:bg-gray-800 transition-all">
                                Sign In
                            </button>
                            <button onClick={() => go("signup")} className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-black px-4 py-2 rounded-xl transition-all">
                                Sign Up
                            </button>
                        </div>
                    ) : (
                        /* ── Logged-in user ── */
                        <div className="hidden md:flex items-center gap-1.5">
                            {isAdmin && (
                                <button onClick={() => go("admin")} className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-xs font-black px-2 py-1.5 rounded-lg hover:bg-blue-400/10 transition-all">
                                    <ShieldCheck size={13} /> Admin
                                </button>
                            )}
                            <button onClick={() => go("dashboard")} className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl px-3 py-2 transition-all">
                                <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center font-black text-white text-xs">
                                    {user?.name?.[0]?.toUpperCase() || "U"}
                                </div>
                                <span className="text-white text-sm font-semibold max-w-[110px] truncate">
                                    {user?.name?.split(" ")[0] || "Account"}
                                </span>
                            </button>
                            <button onClick={onLogout} title="Sign out" className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all">
                                <LogOut size={16} />
                            </button>
                        </div>
                    )}

                    {/* ── Mobile hamburger ── */}
                    <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all">
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* ══ Mobile menu ══ */}
            {menuOpen && (
                <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 py-4 space-y-2">
                    <form onSubmit={handleSearch} className="flex gap-2 mb-3">
                        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search…"
                            className="flex-1 bg-gray-800 text-white px-3 py-2.5 rounded-xl border border-gray-700 text-sm outline-none focus:border-blue-500" />
                        <button type="submit" className="bg-blue-600 text-white px-4 rounded-xl"><Search size={15} /></button>
                    </form>

                    {[["home","🏠","Home"],["shop","🛍️","Shop"],["about","ℹ️","About"],["contact","📬","Contact"]].map(([pg,icon,label]) => (
                        <button key={pg} onClick={() => go(pg)} className="w-full flex items-center gap-3 text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2.5 rounded-xl text-sm text-left">
                            {icon} {label}
                        </button>
                    ))}

                    <div className="border-t border-gray-800 pt-3 space-y-1.5">
                        {/* Cart — always shown in mobile menu too */}
                        <button onClick={handleCart} className="w-full flex items-center justify-between text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2.5 rounded-xl text-sm">
                            <div className="flex items-center gap-3"><ShoppingCart size={16} /> Cart</div>
                            {totalItems > 0 && <span className="bg-blue-600 text-white text-xs font-black px-2 py-0.5 rounded-full">{totalItems}</span>}
                        </button>

                        {isGuest ? (
                            <div className="flex gap-2 pt-1">
                                <button onClick={() => go("login")} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-xl text-sm font-semibold">Sign In</button>
                                <button onClick={() => go("signup")} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-sm font-black">Sign Up</button>
                            </div>
                        ) : (
                            <>
                                <button onClick={() => go("dashboard")} className="w-full flex items-center gap-3 text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2.5 rounded-xl text-sm text-left">
                                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center font-black text-white text-xs">{user?.name?.[0]?.toUpperCase() || "U"}</div>
                                    My Account
                                </button>
                                {isAdmin && (
                                    <button onClick={() => go("admin")} className="w-full text-left text-blue-400 hover:bg-blue-400/10 px-3 py-2.5 rounded-xl text-sm">🛡️ Admin Panel</button>
                                )}
                                <button onClick={() => { onLogout(); setMenuOpen(false); }} className="w-full text-left text-red-400 hover:bg-red-400/10 px-3 py-2.5 rounded-xl text-sm">↩ Sign Out</button>
                            </>
                        )}
                    </div>
                </div>
            )}

            <style>{`@keyframes badgePop{0%{transform:scale(.4);opacity:0}70%{transform:scale(1.3)}100%{transform:scale(1);opacity:1}}`}</style>
        </nav>
    );
}