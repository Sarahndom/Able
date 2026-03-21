// /* ══════════════════════════════════════
//    HOME PAGE
// ══════════════════════════════════════ */
// import { useState } from 'react';
// import { PRODUCTS } from '../data/products';
// import ProductCard from "../components/ProductCard";


// function HomePage({ onNav, onAdd }) {
//     const [email, setEmail] = useState('');
//     const flash = PRODUCTS.filter(p => p.disc >= 20).slice(0, 4);
//     const featured = PRODUCTS.slice(0, 8);
//     return (
//         <div>
//             {/* HERO */}
//             <section className="relative bg-gray-900 overflow-hidden">
//                 <div className="absolute inset-0 pointer-events-none">
//                     <div className="absolute top-0 left-0 w-full h-full opacity-5"
//                         style={{ background: 'radial-gradient(ellipse at 20% 50%, #eab308 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #f97316 0%, transparent 50%)' }} />
//                 </div>

//                 <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 relative">
//                     <span
//                         className="inline-block bg-yellow-500/10 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full mb-5 uppercase tracking-widest">
//                         ⚡ New Arrivals 2025
//                     </span>
//                     <h1
//                         className="text-5xl md:text-7xl font-black text-white mb-5 leading-none">
//                         Premium<br />
//                         <span className="text-yellow-500">
//                             Electronics</span><br />At Your<br />
//                         Fingertips</h1>
//                     <p
//                         className="text-gray-400 text-lg mb-8 max-w-lg">
//                         Discover the latest TVs, smartphones, and accessories. Quality guaranteed, prices unmatched.</p>
//                     <div className="flex gap-4 flex-wrap">
//                         <button onClick={() => onNav('shop')}
//                             className="bg-yellow-500 hover:bg-yellow-400 text-black font-black px-8 py-4 rounded-2xl text-lg"
//                             style={{ transition: 'all .2s', boxShadow: '0 0 0 0 rgba(234,179,8,0)' }}>Shop Now →</button>
//                         <button onClick={() => onNav('shop', null, { cat: 'TVs' })}
//                             className="border border-gray-700 hover:border-yellow-500 text-white px-8 py-4 rounded-2xl text-lg" style={{ transition: 'border-color .2s' }}>Browse TVs</button>
//                     </div>

//                     {/* Trust badges */}
//                     <div className="flex gap-6 mt-10 flex-wrap">
//                         {['🚚 Free shipping over $50', '↩️ 30-day returns', '🔒 Secure checkout', '⭐ 4.9/5 rating'].map(b => (
//                             <span key={b} className="text-gray-500 text-sm">{b}</span>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             {/* CATEGORIES */}
//             <section className="max-w-7xl mx-auto px-4 py-12">
//                 <h2 className="text-2xl font-black text-white mb-6">Shop by Category</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     {[
//                         { cat: 'TVs', icon: '📺', desc: `${PRODUCTS.filter(p => p.cat === 'TVs').length} Products`, from: '#1e3a5f', to: '#1e40af', accent: '#3b82f6' },
//                         { cat: 'Phones', icon: '📱', desc: `${PRODUCTS.filter(p => p.cat === 'Phones').length} Products`, from: '#3b0764', to: '#7e22ce', accent: '#a855f7' },
//                         { cat: 'Accessories', icon: '🎧', desc: `${PRODUCTS.filter(p => p.cat === 'Accessories').length} Products`, from: '#431407', to: '#c2410c', accent: '#f97316' },
//                     ].map(({ cat, icon, desc, from, to, accent }) => (
//                         <button key={cat} onClick={() => onNav('shop', null, { cat })}
//                             className="rounded-2xl p-8 text-left relative overflow-hidden group"
//                             style={{ background: `linear-gradient(135deg, ${from}, ${to})`, transition: 'transform .2s,box-shadow .2s' }}
//                             onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = `0 20px 40px ${accent}30` }}
//                             onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}>
//                             <div className="text-5xl mb-3">{icon}</div>
//                             <h3 className="text-white font-black text-2xl">{cat}</h3>
//                             <p className="text-white/60 text-sm mt-1">{desc}</p>
//                             <div className="mt-4 text-white/80 text-sm font-semibold">Browse {cat} →</div>
//                         </button>
//                     ))}
//                 </div>
//             </section>

//             {/* FLASH DEALS */}
//             <section className="max-w-7xl mx-auto px-4 py-8">
//                 <div className="flex items-center justify-between mb-6">
//                     <div className="flex items-center gap-3">
//                         <span className="text-2xl">⚡</span>
//                         <h2 className="text-2xl font-black text-white">Flash Deals</h2>
//                         <span className="bg-red-600 text-white text-xs font-black px-2 py-1 rounded-full" style={{ animation: 'pulse 2s infinite' }}>LIVE</span>
//                     </div>
//                     <button onClick={() => onNav('shop')} className="text-yellow-400 hover:text-yellow-300 text-sm font-semibold" style={{ transition: 'color .15s' }}>View All →</button>
//                 </div>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     {flash.map(p => <ProductCard key={p.id} p={p} onAdd={onAdd} onNav={onNav} />)}
//                 </div>
//             </section>

//             {/* PROMO BANNER */}
//             <section className="max-w-7xl mx-auto px-4 py-6">
//                 <div className="rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6" style={{ background: 'linear-gradient(135deg, #eab308, #f97316)' }}>
//                     <div>
//                         <h2 className="text-3xl font-black text-black mb-1">Free Shipping on Orders Over $50</h2>
//                         <p className="text-black/70">Shop today and get free delivery to your doorstep</p>
//                     </div>
//                     <button onClick={() => onNav('shop')} className="bg-black text-white font-black px-8 py-4 rounded-2xl flex-shrink-0 hover:bg-gray-900" style={{ transition: 'background .15s' }}>Shop Now →</button>
//                 </div>
//             </section>

//             {/* FEATURED */}
//             <section className="max-w-7xl mx-auto px-4 py-8">
//                 <div className="flex items-center justify-between mb-6">
//                     <h2 className="text-2xl font-black text-white">Featured Products</h2>
//                     <button onClick={() => onNav('shop')} className="text-yellow-400 hover:text-yellow-300 text-sm font-semibold" style={{ transition: 'color .15s' }}>View All →</button>
//                 </div>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     {featured.map(p => <ProductCard key={p.id} p={p} onAdd={onAdd} onNav={onNav} />)}
//                 </div>
//             </section>

//             {/* NEWSLETTER */}
//             <section className="max-w-7xl mx-auto px-4 py-12">
//                 <div className="bg-gray-800 rounded-2xl p-10 text-center max-w-2xl mx-auto">
//                     <h3 className="text-3xl font-black text-white mb-2">Stay Updated</h3>
//                     <p className="text-gray-400 mb-6">Subscribe for exclusive deals and new arrivals</p>
//                     <form onSubmit={e => { e.preventDefault(); alert('Thanks for subscribing! 🎉'); setEmail(''); }}
//                         className="flex gap-3 max-w-md mx-auto">

//                         <input value={email} onChange={e => setEmail(e.target.value)}
//                             type="email" placeholder="Enter your email…" required

//                             className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:border-yellow-500 text-sm" />
//                         <button type="submit" className="bg-yellow-500 hover:bg-yellow-400 text-black font-black px-6 py-3 rounded-xl text-sm" style={{ transition: 'background .15s' }}>Subscribe</button>
//                     </form>
//                 </div>
//             </section>
//         </div>
//     );
// }

// export default HomePage


/* ══════════════════════════════════════
   HOME PAGE
══════════════════════════════════════ */
import { useState } from 'react';
import { PRODUCTS } from '../data/products';
import ProductCard from "../components/ProductCard";

function HomePage({ onNav, onAdd }) {
    const [email, setEmail] = useState('');
    const flash = PRODUCTS.filter(p => p.disc >= 20).slice(0, 4);
    const featured = PRODUCTS.slice(0, 8);

    return (
        <div>
            {/* HERO SECTION */}
            <section className="relative bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10"
                        style={{ background: 'radial-gradient(ellipse at 20% 50%, #0066FF 0%, transparent 60%)' }} />
                </div>

                <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 relative">
                    <span className="inline-block bg-[#0066FF]/10 text-[#0066FF] text-xs font-bold px-3 py-1 rounded-full mb-5 uppercase tracking-widest">
                        ⚡ New Arrivals 2026
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-5 leading-none">
                        Premium<br />
                        <span className="text-[#0066FF]">Electronics</span><br />At Your Fingertips
                    </h1>
                    <p className="text-gray-400 text-lg mb-8 max-w-lg">
                        Discover the latest TVs, smartphones, and accessories. Quality guaranteed, prices unmatched.
                    </p>
                    <div className="flex gap-4 flex-wrap">
                        <button onClick={() => onNav('shop')}
                            className="bg-[#0066FF] hover:bg-[#0052cc] text-white font-black px-8 py-4 rounded-2xl text-lg transition-all">
                            Shop Now →
                        </button>
                        <button onClick={() => onNav('shop', null, { cat: 'TVs' })}
                            className="border border-gray-700 hover:border-[#0066FF] text-white px-8 py-4 rounded-2xl text-lg transition-all">
                            Browse TVs
                        </button>
                    </div>
                </div>
            </section>

            {/* CATEGORIES */}
            <section className="max-w-7xl mx-auto px-4 py-12">
                <h2 className="text-2xl font-black text-white mb-6">Shop by Category</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { cat: 'TVs', icon: '📺', desc: `${PRODUCTS.filter(p => p.cat === 'TVs').length} Products`, from: '#002d70', to: '#0066FF', accent: '#0066FF' },
                        { cat: 'Phones', icon: '📱', desc: `${PRODUCTS.filter(p => p.cat === 'Phones').length} Products`, from: '#3b0764', to: '#7e22ce', accent: '#a855f7' },
                        { cat: 'Accessories', icon: '🎧', desc: `${PRODUCTS.filter(p => p.cat === 'Accessories').length} Products`, from: '#111827', to: '#374151', accent: '#0066FF' },
                    ].map(({ cat, icon, desc, from, to, accent }) => (
                        <button key={cat} onClick={() => onNav('shop', null, { cat })}
                            className="rounded-2xl p-8 text-left relative overflow-hidden group"
                            style={{ background: `linear-gradient(135deg, ${from}, ${to})`, transition: 'transform .2s,box-shadow .2s' }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = `0 20px 40px ${accent}30` }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}>
                            <div className="text-5xl mb-3">{icon}</div>
                            <h3 className="text-white font-black text-2xl">{cat}</h3>
                            <p className="text-white/60 text-sm mt-1">{desc}</p>
                            <div className="mt-4 text-white/80 text-sm font-semibold">Browse {cat} →</div>
                        </button>
                    ))}
                </div>
            </section>

            {/* FLASH DEALS */}
            <section className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">⚡</span>
                        <h2 className="text-2xl font-black text-white">Flash Deals</h2>
                        <span className="bg-red-600 text-white text-xs font-black px-2 py-1 rounded-full animate-pulse">LIVE</span>
                    </div>
                    <button onClick={() => onNav('shop')} className="text-[#0066FF] hover:text-[#0052cc] text-sm font-semibold transition-colors">View All →</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {flash.map(p => <ProductCard key={p.id} p={p} onAdd={onAdd} onNav={onNav} />)}
                </div>
            </section>

            {/* PROMO BANNER */}
            <section className="max-w-7xl mx-auto px-4 py-6">
                <div className="rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6"
                    style={{ background: 'linear-gradient(135deg, #0066FF, #003380)' }}>
                    <div>
                        <h2 className="text-3xl font-black text-white mb-1">Free Shipping on Orders Over $50</h2>
                        <p className="text-white/80">Shop today and get free delivery to your doorstep</p>
                    </div>
                    <button onClick={() => onNav('shop')}
                        className="bg-white text-[#0066FF] font-black px-8 py-4 rounded-2xl flex-shrink-0 hover:bg-gray-100 transition-all">
                        Shop Now →
                    </button>
                </div>
            </section>

            {/* FEATURED */}
            <section className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-white">Featured Products</h2>
                    <button onClick={() => onNav('shop')} className="text-[#0066FF] hover:text-[#0052cc] text-sm font-semibold transition-colors">View All →</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {featured.map(p => <ProductCard key={p.id} p={p} onAdd={onAdd} onNav={onNav} />)}
                </div>
            </section>

            {/* NEWSLETTER */}
            <section className="max-w-7xl mx-auto px-4 py-12">
                <div className="bg-gray-800 rounded-2xl p-10 text-center max-w-2xl mx-auto">
                    <h3 className="text-3xl font-black text-white mb-2">Stay Updated</h3>
                    <p className="text-gray-400 mb-6">Subscribe for exclusive deals and new arrivals</p>
                    <form onSubmit={e => { e.preventDefault(); alert('Thanks for subscribing! 🎉'); setEmail(''); }}
                        className="flex gap-3 max-w-md mx-auto">
                        <input value={email} onChange={e => setEmail(e.target.value)}
                            type="email" placeholder="Enter your email…" required
                            className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:border-[#0066FF] text-sm" />
                        <button
                            type="submit" className="bg-[#0066FF] hover:bg-[#0052cc] text-white font-black px-6 py-3 rounded-xl text-sm transition-all">
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}

export default HomePage;