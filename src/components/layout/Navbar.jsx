import { useState } from "react";
import { useCart } from "../../context/CartContext";

export default function Navbar({ user, onNav, onLogout }) {
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState('');

    const { cart } = useCart(); // ✅ CORRECT PLACE

    const count = cart.reduce((s, i) => s + i.qty, 0);

    const search = (e) => {
        e.preventDefault();
        if (q.trim()) {
            onNav('shop', null, { q });
            setQ('');
            setOpen(false);
        }
    };

    return (
        <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 flex items-center h-16 gap-4">

                {/* LOGO */}
                <div
                    className="flex items-center gap-2 cursor-pointer flex-shrink-0"
                    onClick={() => onNav('home')}
                >
                    <div className="w-9 h-9 bg-yellow-500 rounded-xl flex items-center justify-center font-black text-black text-lg">
                        E
                    </div>
                    <span className="font-black text-xl text-white hidden sm:block">
                        Electro<span className="text-yellow-500">Store</span>
                    </span>
                </div>

                {/* SEARCH */}
                <form onSubmit={search} className="hidden md:flex flex-1 max-w-md">
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search…"
                        className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-l-xl border border-gray-700"
                    />
                    <button className="bg-yellow-500 text-black px-4 rounded-r-xl">
                        🔍
                    </button>
                </form>

                {/* CART */}
                <button
                    onClick={() => onNav('cart')}
                    className="relative text-gray-300 text-xl ml-auto"
                >
                    🛒
                    {count > 0 && (
                        <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-black">
                            {count}
                        </span>
                    )}
                </button>

                {user?.role === 'admin' && (
                    <button
                        onClick={() => onNav('admin')}
                        className="text-gray-300 ml-4 text-sm font-bold hover:text-yellow-500"
                    >
                        Admin
                    </button>
                )}
            </div>
        </nav>
    );
}