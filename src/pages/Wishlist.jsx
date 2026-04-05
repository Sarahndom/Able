import { useState, useEffect } from "react";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";

// ─────────────────────────────────────────────────────────
//  Wishlist helpers (localStorage-backed)
// ─────────────────────────────────────────────────────────
export const getWishlist = () => {
    try {
        return JSON.parse(localStorage.getItem("wishlist") || "[]");
    } catch {
        return [];
    }
};

export const addToWishlist = (product) => {
    const list = getWishlist();
    if (!list.find(p => p.id === product.id)) {
        list.push(product);
        localStorage.setItem("wishlist", JSON.stringify(list));
    }
};

export const removeFromWishlist = (productId) => {
    const list = getWishlist().filter(p => p.id !== productId);
    localStorage.setItem("wishlist", JSON.stringify(list));
};

export const isInWishlist = (productId) => {
    return getWishlist().some(p => p.id === productId);
};

export const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
        return false;
    } else {
        addToWishlist(product);
        return true;
    }
};

// ─────────────────────────────────────────────────────────
//  WishlistPage component
// ─────────────────────────────────────────────────────────
function WishlistPage({ onNav, onAdd, user }) {
    const [items, setItems] = useState([]);
    const [addedIds, setAddedIds] = useState([]);

    // Load from localStorage on mount
    useEffect(() => {
        setItems(getWishlist());
    }, []);

    const handleRemove = (id) => {
        removeFromWishlist(id);
        setItems(prev => prev.filter(p => p.id !== id));
    };

    const handleClearAll = () => {
        localStorage.setItem("wishlist", "[]");
        setItems([]);
    };

    const handleAddToCart = (product) => {
        if (!user) {
            onNav('login');
            return;
        }
        onAdd(product);
        setAddedIds(prev => [...prev, product.id]);
        setTimeout(() => setAddedIds(prev => prev.filter(i => i !== product.id)), 2000);
    };

    const handleMoveAll = () => {
        if (!user) {
            onNav('login');
            return;
        }
        items.forEach(p => onAdd(p));
        handleClearAll();
    };

    // ── Empty State ──
    if (items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <div className="w-24 h-24 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart size={40} className="text-blue-400" />
                </div>
                <h2 className="text-3xl font-black text-white mb-3">Your Wishlist is Empty</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    Save your favourite items here so you can find them easily later.
                </p>
                <button
                    onClick={() => onNav('shop')}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-4 rounded-2xl text-base transition-all"
                >
                    Browse Products <ArrowRight size={18} />
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                        <Heart size={28} className="text-blue-400" />
                        My Wishlist
                        <span className="text-gray-500 font-normal text-lg">({items.length} item{items.length !== 1 ? 's' : ''})</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Items you've saved for later</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                    {items.length > 0 && (
                        <>
                            <button
                                onClick={handleMoveAll}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all"
                            >
                                <ShoppingCart size={16} /> Add All to Cart
                            </button>
                            <button
                                onClick={handleClearAll}
                                className="flex items-center gap-2 border border-gray-700 hover:border-red-500/50 text-gray-400 hover:text-red-400 font-bold px-4 py-2.5 rounded-xl text-sm transition-all"
                            >
                                <Trash2 size={16} /> Clear All
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {items.map(product => (
                    <div
                        key={product.id}
                        className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700/50 hover:border-blue-500/30 transition-all group"
                    >
                        {/* Image */}
                        <div
                            className="relative aspect-video overflow-hidden cursor-pointer"
                            onClick={() => onNav('product-detail', product)}
                        >
                            <img
                                src={product.img}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={e => e.target.src = 'https://placehold.co/400x225/1f2937/6b7280?text=Product'}
                            />

                            {/* Discount Badge */}
                            {product.disc > 0 && (
                                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full">
                                    -{product.disc}%
                                </span>
                            )}

                            {/* Remove Button */}
                            <button
                                onClick={(e) => { e.stopPropagation(); handleRemove(product.id); }}
                                className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                                title="Remove from wishlist"
                            >
                                <X size={14} />
                            </button>
                        </div>

                        {/* Info */}
                        <div className="p-4">
                            <p className="text-gray-500 text-xs mb-1">{product.brand}</p>
                            <h3
                                className="text-white font-bold text-sm mb-2 line-clamp-2 cursor-pointer hover:text-blue-400 transition-colors"
                                onClick={() => onNav('product-detail', product)}
                            >
                                {product.name}
                            </h3>

                            {/* Stars */}
                            <div className="flex items-center gap-1 mb-3">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <svg key={i} className={`w-3 h-3 ${i <= Math.floor(product.rating) ? 'text-blue-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                                <span className="text-gray-500 text-xs ml-1">({product.reviews})</span>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-blue-400 font-black text-lg">${product.price}</span>
                                {product.disc > 0 && (
                                    <span className="text-gray-500 text-sm line-through">${product.orig}</span>
                                )}
                            </div>

                            {/* Stock */}
                            <p className={`text-xs mb-3 ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {product.stock > 0 ? `✓ In Stock (${product.stock} left)` : '✗ Out of Stock'}
                            </p>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    disabled={product.stock === 0}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${addedIds.includes(product.id)
                                        ? 'bg-green-500 text-white'
                                        : product.stock === 0
                                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-500 text-white'
                                        }`}
                                >
                                    {addedIds.includes(product.id) ? (
                                        <><Check size={14} /> Added!</>
                                    ) : (
                                        <><ShoppingCart size={14} /> {product.stock > 0 ? 'Add to Cart' : 'Unavailable'}</>
                                    )}
                                </button>
                                <button
                                    onClick={() => handleRemove(product.id)}
                                    className="w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-xl transition-all"
                                    title="Remove"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Continue Shopping */}
            <div className="text-center mt-12">
                <button
                    onClick={() => onNav('shop')}
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-6 py-3 rounded-2xl text-sm transition-all"
                >
                    ← Continue Shopping
                </button>
            </div>
        </div>
    );
}

// Small X icon used internally
function X({ size = 16 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}

function Check({ size = 16 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

export default WishlistPage;