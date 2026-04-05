// function CartPage({ cart, dispatch, onNav }) {

//     const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
//     const shipping = subtotal > 50 ? 0 : 9.99;
//     const total = subtotal + shipping;

//     if (cart.length === 0) {
//         return (
//             <div className="max-w-7xl mx-auto px-4 py-20 sm:py-24 text-center">
//                 <div className="text-6xl sm:text-7xl mb-5">🛒</div>
//                 <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Your cart is empty</h2>
//                 <p className="text-gray-400 mb-7">Looks like you haven't added anything yet.</p>
//                 <button
//                     onClick={() => onNav('shop')}
//                     className="bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-4 rounded-2xl text-lg transition-all"
//                 >
//                     Start Shopping
//                 </button>
//             </div>
//         );
//     }

//     return (
//         <div className="max-w-7xl mx-auto px-4 py-8">
//             <h1 className="text-2xl sm:text-3xl font-black text-white mb-6">
//                 Shopping Cart{" "}
//                 <span className="text-gray-500 font-normal text-lg sm:text-xl">
//                     ({cart.reduce((s, i) => s + i.qty, 0)} items)
//                 </span>
//             </h1>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//                 {/* CART ITEMS */}
//                 <div className="lg:col-span-2 space-y-3 sm:space-y-4">
//                     {cart.map((item) => (
//                         <div
//                             key={item.id}
//                             className="bg-gray-800 rounded-2xl p-4 flex items-center gap-3 sm:gap-4"
//                         >
//                             <img
//                                 src={item.img}
//                                 alt={item.name}
//                                 className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl flex-shrink-0"
//                                 onError={e => e.target.src = "https://placehold.co/80x80/1f2937/6b7280"}
//                             />

//                             <div className="flex-1 min-w-0">
//                                 <h3 className="text-white font-semibold text-sm truncate">{item.name}</h3>
//                                 <p className="text-gray-500 text-xs">{item.brand}</p>
//                                 <p className="text-blue-400 font-bold mt-0.5">${item.price}</p>
//                             </div>

//                             {/* Quantity Control */}
//                             <div className="flex items-center bg-gray-700 rounded-xl overflow-hidden flex-shrink-0">
//                                 <button
//                                     onClick={() => {
//                                         if (item.qty === 1) {
//                                             dispatch({ type: "REMOVE", id: item.id });
//                                         } else {
//                                             dispatch({ type: "QTY", id: item.id, qty: item.qty - 1 });
//                                         }
//                                     }}
//                                     className="w-8 h-8 sm:w-9 sm:h-9 text-gray-400 hover:text-white flex items-center justify-center transition-colors text-lg"
//                                 >
//                                     −
//                                 </button>
//                                 <span className="w-7 sm:w-8 text-center text-white font-bold text-sm">
//                                     {item.qty}
//                                 </span>
//                                 <button
//                                     onClick={() => dispatch({ type: "QTY", id: item.id, qty: item.qty + 1 })}
//                                     className="w-8 h-8 sm:w-9 sm:h-9 text-gray-400 hover:text-white flex items-center justify-center transition-colors text-lg"
//                                 >
//                                     +
//                                 </button>
//                             </div>

//                             <div className="text-right flex-shrink-0">
//                                 <p className="text-white font-black text-sm sm:text-base">
//                                     ${(item.price * item.qty).toFixed(2)}
//                                 </p>
//                                 <button
//                                     onClick={() => dispatch({ type: "REMOVE", id: item.id })}
//                                     className="text-red-500 hover:text-red-400 text-xs transition-colors mt-1"
//                                 >
//                                     Remove
//                                 </button>
//                             </div>
//                         </div>
//                     ))}

//                     <button
//                         onClick={() => dispatch({ type: "CLEAR" })}
//                         className="text-gray-600 hover:text-red-400 text-sm mt-2 transition-colors"
//                     >
//                         🗑 Clear cart
//                     </button>
//                 </div>

//                 {/* ORDER SUMMARY */}
//                 <div className="bg-gray-800 rounded-2xl p-5 sm:p-6 h-fit lg:sticky lg:top-20">
//                     <h3 className="text-white font-black text-xl mb-5">Order Summary</h3>

//                     <div className="space-y-3 text-sm mb-5">
//                         <div className="flex justify-between text-gray-400">
//                             <span>Subtotal</span>
//                             <span className="text-white">${subtotal.toFixed(2)}</span>
//                         </div>
//                         <div className="flex justify-between text-gray-400">
//                             <span>Shipping</span>
//                             <span className={shipping === 0 ? "text-green-400" : "text-white"}>
//                                 {shipping === 0 ? "FREE ✓" : `$${shipping.toFixed(2)}`}
//                             </span>
//                         </div>
//                         {subtotal < 50 && (
//                             <p className="text-blue-400 text-xs">
//                                 Add ${(50 - subtotal).toFixed(2)} more for free shipping!
//                             </p>
//                         )}
//                         <div className="border-t border-gray-700 pt-3 flex justify-between font-black text-lg">
//                             <span className="text-white">Total</span>
//                             <span className="text-blue-400">${total.toFixed(2)}</span>
//                         </div>
//                     </div>

//                     <button
//                         onClick={() => onNav("checkout")}
//                         className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl text-base sm:text-lg transition-all"
//                     >
//                         Proceed to Checkout
//                     </button>

//                     <button
//                         onClick={() => onNav('shop')}
//                         className="w-full mt-3 text-gray-500 hover:text-gray-300 text-sm py-2 transition-colors"
//                     >
//                         ← Continue Shopping
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default CartPage;


import { useState } from "react";
import { ShoppingCart, User, LogOut, ShieldCheck, Menu, X, Search } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Navbar({ user, onNav, onLogout, showToast }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [q, setQ] = useState("");

    /* ── Live badge — reads from CartContext, updates instantly ── */
    const { totalItems } = useCart();

    const isGuest = !user;
    const isAdmin = user?.role === "admin" || user?.email === "admin@electrostore.com";

    const go = (page) => { setMenuOpen(false); onNav(page); };

    const handleSearch = (e) => {
        e.preventDefault();
        if (q.trim()) { onNav("shop", null, { q: q.trim() }); setQ(""); setMenuOpen(false); }
    };

    const handleCart = () => {
        if (isGuest) { showToast?.("Please sign in to view your cart", "error"); go("login"); }
        else go("cart");
    };

    return (
        <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 shadow-lg shadow-black/20">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-3">

                {/* Logo */}
                <button onClick={() => go("home")} className="flex items-center gap-2 flex-shrink-0 group">
                    <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-lg shadow-blue-600/30 group-hover:bg-blue-500 transition-colors">
                        AE
                    </div>
                    <div className="hidden sm:block">
                        <span className="font-black text-base text-white leading-none">Able</span>
                        <span className="font-black text-base text-blue-400 leading-none">Enterprise</span>
                    </div>
                </button>

                {/* Search (desktop) */}
                <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-4">
                    <div className="flex w-full rounded-xl overflow-hidden border border-gray-700 focus-within:border-blue-500 transition-colors">
                        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search products…"
                            className="flex-1 bg-gray-800 text-white px-4 py-2 text-sm outline-none placeholder-gray-600" />
                        <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-4 text-white transition-colors flex items-center">
                            <Search size={16} />
                        </button>
                    </div>
                </form>

                {/* Right actions */}
                <div className="flex items-center gap-1 sm:gap-2 ml-auto">

                    {/* Cart badge — always shows for logged-in users */}
                    {!isGuest && (
                        <button onClick={handleCart}
                            className="relative p-2.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl transition-all group"
                            aria-label={`Cart, ${totalItems} items`}>
                            <ShoppingCart size={22} className="transition-transform group-hover:scale-110" />

                            {/* ── LIVE BADGE ── re-keys on change to trigger pop animation */}
                            {totalItems > 0 && (
                                <span key={totalItems}
                                    className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-blue-600 text-white text-[11px] font-black rounded-full flex items-center justify-center px-1 shadow-lg shadow-blue-600/40"
                                    style={{ animation: "badgePop 0.25s ease-out" }}>
                                    {totalItems > 99 ? "99+" : totalItems}
                                </span>
                            )}
                        </button>
                    )}

                    {/* Guest: sign in/up buttons */}
                    {isGuest ? (
                        <div className="hidden sm:flex items-center gap-2">
                            <button onClick={() => go("login")} className="text-gray-400 hover:text-white text-sm font-semibold px-3 py-2 rounded-xl hover:bg-gray-800 transition-all">Sign In</button>
                            <button onClick={() => go("signup")} className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-black px-4 py-2 rounded-xl transition-all">Sign Up</button>
                        </div>
                    ) : (
                        /* Logged-in user */
                        <div className="hidden md:flex items-center gap-1.5">
                            {isAdmin && (
                                <button onClick={() => go("admin")} className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-xs font-black px-2 py-1.5 rounded-lg hover:bg-blue-400/10 transition-all">
                                    <ShieldCheck size={13} /> Admin
                                </button>
                            )}
                            <button onClick={() => go("dashboard")} className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-xl px-3 py-2 transition-all">
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

                    {/* Mobile hamburger */}
                    <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all">
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* ── Mobile menu ── */}
            {menuOpen && (
                <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 py-4 space-y-2">
                    <form onSubmit={handleSearch} className="flex gap-2 mb-3">
                        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search products…"
                            className="flex-1 bg-gray-800 text-white px-3 py-2.5 rounded-xl border border-gray-700 text-sm outline-none focus:border-blue-500 transition-colors" />
                        <button type="submit" className="bg-blue-600 text-white px-4 rounded-xl"><Search size={15} /></button>
                    </form>

                    {[["home", "🏠", "Home"], ["shop", "🛍️", "Shop"], ["about", "ℹ️", "About"], ["contact", "📬", "Contact"]].map(([page, icon, label]) => (
                        <button key={page} onClick={() => go(page)} className="w-full flex items-center gap-3 text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2.5 rounded-xl text-sm transition-all text-left">
                            {icon} {label}
                        </button>
                    ))}

                    <div className="border-t border-gray-800 pt-3 space-y-2">
                        {isGuest ? (
                            <div className="flex gap-2">
                                <button onClick={() => go("login")} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-all">Sign In</button>
                                <button onClick={() => go("signup")} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-sm font-black transition-all">Sign Up</button>
                            </div>
                        ) : (
                            <>
                                <button onClick={handleCart} className="w-full flex items-center justify-between text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2.5 rounded-xl text-sm transition-all">
                                    <div className="flex items-center gap-3"><ShoppingCart size={16} /> Cart</div>
                                    {totalItems > 0 && <span className="bg-blue-600 text-white text-xs font-black px-2 py-0.5 rounded-full">{totalItems}</span>}
                                </button>
                                <button onClick={() => go("dashboard")} className="w-full flex items-center gap-3 text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2.5 rounded-xl text-sm transition-all text-left">
                                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center font-black text-white text-xs">{user?.name?.[0]?.toUpperCase() || "U"}</div>
                                    My Account
                                </button>
                                {isAdmin && (
                                    <button onClick={() => go("admin")} className="w-full text-left text-blue-400 hover:bg-blue-400/10 px-3 py-2.5 rounded-xl text-sm transition-all">🛡️ Admin Panel</button>
                                )}
                                <button onClick={() => { onLogout(); setMenuOpen(false); }} className="w-full text-left text-red-400 hover:bg-red-400/10 px-3 py-2.5 rounded-xl text-sm transition-all">
                                    ↩ Sign Out
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Badge pop animation */}
            <style>{`@keyframes badgePop { 0%{transform:scale(.5);opacity:0} 70%{transform:scale(1.25)} 100%{transform:scale(1);opacity:1} }`}</style>
        </nav>
    );
}