/* ══════════════════════════════════════
   PRODUCT DETAIL
══════════════════════════════════════ */
import { useState } from "react";
import { PRODUCTS } from "../data/products";
import Badge from "../components/ui/Badge";
import Stars from "../components/ui/Stars";
import ProductCard from "../components/ProductCard";


function ProductDetailPage({ product, onAdd, onNav }) {
    const [qty, setQty] = useState(1);
    const [activeTab, setActiveTab] = useState('desc');
    if (!product) return (
        <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">😕</div>
            <p>Product not found.</p>
            <button onClick={() => onNav('shop')} className="mt-3 text-blue-400 hover:underline text-sm">Back to Shop</button>
        </div>
    );
    const related = PRODUCTS.filter(p => p.cat === product.cat && p.id !== product.id).slice(0, 4);
    const mockReviews = [
        { user: 'Alex M.', rating: 5, date: 'Jan 15, 2025', comment: 'Absolutely fantastic product! Exactly as described. Fast shipping and great packaging.' },
        { user: 'Sarah K.', rating: 4, date: 'Dec 28, 2024', comment: 'Great value for money. The quality is excellent and matches the description perfectly.' },
        { user: 'James R.', rating: 5, date: 'Nov 12, 2024', comment: "One of the best purchases I've made. Works flawlessly and looks premium." },
    ];
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <button onClick={() => onNav('shop')} className="text-gray-400 hover:text-blue-400 text-sm mb-6 flex items-center gap-1 font-semibold" style={{ transition: 'color .15s' }}>← Back to Shop</button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                {/* Image */}
                <div>
                    <div className="bg-gray-800 rounded-2xl overflow-hidden aspect-video">
                        <img src={product.img} alt={product.name} className="w-full h-full object-cover" onError={e => e.target.src = 'https://placehold.co/600x400/1f2937/6b7280?text=Product'} />
                    </div>
                </div>
                {/* Info */}
                <div>
                    <div className="flex gap-2 mb-3">
                        <Badge status={product.stock > 0 ? 'In Stock' : 'Out of Stock'} />
                        <span className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full">{product.cat}</span>
                    </div>
                    <p className="text-gray-500 text-sm mb-1">{product.brand}</p>
                    <h1 className="text-3xl font-black text-white mb-4">{product.name}</h1>
                    <div className="flex items-center gap-2 mb-4">
                        <Stars r={product.rating} /><span className="text-blue-400 font-bold">{product.rating}</span>
                        <span className="text-gray-500 text-sm">({product.reviews} reviews)</span>
                    </div>
                    <div className="flex items-baseline gap-3 mb-5">
                        <span className="text-5xl font-black text-blue-400">${product.price}</span>
                        {product.disc > 0 && <>
                            <span className="text-gray-500 text-xl line-through">${product.orig}</span>
                            <span className="bg-orange-500/20 text-orange-400 text-sm px-3 py-1 rounded-full font-bold">Save {product.disc}%</span>
                        </>}
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-6">{product.desc}</p>
                    <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                        <div className="bg-gray-800 rounded-xl p-3"><p className="text-gray-500 text-xs mb-1">SKU</p><p className="text-white font-mono">{product.sku}</p></div>
                        <div className="bg-gray-800 rounded-xl p-3"><p className="text-gray-500 text-xs mb-1">Stock</p><p className={product.stock > 0 ? 'text-green-400' : 'text-red-400'}>{product.stock > 0 ? `${product.stock} available` : 'Unavailable'}</p></div>
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                            <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-11 h-11 text-gray-400 hover:text-white text-2xl font-light flex items-center justify-center" style={{ transition: 'color .15s' }}>−</button>
                            <span className="w-10 text-center text-white font-bold">{qty}</span>
                            <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-11 h-11 text-gray-400 hover:text-white text-2xl font-light flex items-center justify-center" style={{ transition: 'color .15s' }}>+</button>
                        </div>
                        <button onClick={() => { for (let i = 0; i < qty; i++)onAdd(product); }} disabled={product.stock === 0}
                            className="flex-1 bg-blue-500 hover:bg-blue-400 disabled:opacity-40 text-black font-black py-3 rounded-xl text-lg" style={{ transition: 'background .15s' }}>
                            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
                        {['🚚 Free shipping $50+', '↩️ 30-day returns', '🔒 Secure payment'].map(f => (
                            <div key={f} className="bg-gray-800 rounded-xl p-2 text-center">{f}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-700 mb-6">
                <div className="flex gap-6">
                    {[['desc', 'Description'], ['reviews', 'Reviews'], ['shipping', 'Shipping']].map(([k, l]) => (
                        <button key={k} onClick={() => setActiveTab(k)}
                            className={`pb-3 text-sm font-semibold border-b-2 -mb-px ${activeTab === k ? 'border-blue -500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`} style={{ transition: 'all .15s' }}>
                            {l}
                        </button>
                    ))}
                </div>
            </div>
            {activeTab === 'desc' && <p className="text-gray-300 leading-relaxed max-w-2xl">{product.desc}</p>}
            {activeTab === 'reviews' && (
                <div className="space-y-4 max-w-2xl">
                    {mockReviews.map(r => (
                        <div key={r.user} className="bg-gray-800 rounded-xl p-5">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold">{r.user[0]}</div>
                                    <div><p className="text-white font-semibold text-sm">{r.user}</p><p className="text-gray-500 text-xs">{r.date}</p></div>
                                </div>
                                <Stars r={r.rating} />
                            </div>
                            <p className="text-gray-300 text-sm">{r.comment}</p>
                        </div>
                    ))}
                </div>
            )}
            {activeTab === 'shipping' && (
                <div className="space-y-3 max-w-2xl">
                    {[['Standard Shipping', '5–7 business days', 'Free on orders over $50'], ['Express Shipping', '2–3 business days', '$12.99'], ['Next Day Delivery', 'Next business day', '$24.99']].map(([n, t, p]) => (
                        <div key={n} className="bg-gray-800 rounded-xl p-4 flex justify-between items-center">
                            <div><p className="text-white font-semibold text-sm">{n}</p><p className="text-gray-400 text-xs">{t}</p></div>
                            <span className="text-blue-400 text-sm font-bold">{p}</span>
                        </div>
                    ))}
                </div>
            )}

            {related.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-2xl font-black text-white mb-6">Related Products</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {related.map(p => <ProductCard key={p.id} p={p} onAdd={onAdd} onNav={onNav} />)}
                    </div>
                </div>
            )}
        </div>
    );
}


export default ProductDetailPage