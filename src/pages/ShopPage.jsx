/* ══════════════════════════════════════
   SHOP PAGE
══════════════════════════════════════ */
import { useState } from "react";
import { PRODUCTS, CATS } from "../data/products";
import ProductCard from "../components/ProductCard";

function ShopPage({ onNav, onAdd, initialQ = '', initialCat = '' }) {
    const [q, setQ] = useState(initialQ);
    const [cat, setCat] = useState(initialCat);
    const [sort, setSort] = useState('featured');
    const [maxPrice, setMaxPrice] = useState(2000);
    const [minRating, setMinRating] = useState(0);

    const handleSearch = (e) => {
        e.preventDefault(); // prevents reload
    };

    let filtered = PRODUCTS.filter(p => {
        if (cat && p.cat !== cat) return false;
        if (
            q &&
            !p.name.toLowerCase().includes(q.toLowerCase()) &&
            !p.brand.toLowerCase().includes(q.toLowerCase())
        ) return false;
        if (p.price > maxPrice) return false;
        if (p.rating < minRating) return false;
        return true;
    });

    const sorted = [...filtered];
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    else if (sort === 'discount') sorted.sort((a, b) => b.disc - a.disc);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-black text-white mb-6">
                {cat || 'All Products'}{" "}
                <span className="text-gray-500 font-normal text-lg">
                    ({sorted.length} items)
                </span>
            </h1>

            <div className="flex flex-col lg:flex-row gap-6">

                {/* SIDEBAR */}
                {/* <aside className="lg:w-60 flex-shrink-0">
                    <div className="bg-gray-800 rounded-2xl p-5 space-y-6 sticky top-20">

                        <form onSubmit={handleSearch}>
                            <p className="text-white font-bold text-sm mb-2">Search</p>
                            <div className="flex gap-2">
                                <input
                                    value={q}
                                    onChange={e => setQ(e.target.value)}
                                    placeholder="Search products…"
                                    className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-xl border border-gray-600 focus:outline-none focus:border-blue-500 text-sm"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-400 text-black px-3 rounded-xl text-sm font-bold"
                                >
                                    🔍
                                </button>
                            </div>
                        </form>

                        <div>
                            <p className="text-white font-bold text-sm mb-2">Category</p>
                            <div className="space-y-1.5">
                                {['', ...CATS].map(c => (
                                    <label key={c} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="cat"
                                            checked={cat === c}
                                            onChange={() => setCat(c)}
                                            className="accent-blue-500"
                                        />
                                        <span className="text-gray-300 text-sm">
                                            {c || 'All'}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-white font-bold text-sm mb-2">
                                Max Price: <span className="text-blue-400">${maxPrice}</span>
                            </p>
                            <input
                                type="range"
                                min="50"
                                max="2000"
                                step="50"
                                value={maxPrice}
                                onChange={e => setMaxPrice(+e.target.value)}
                                className="w-full accent-blue-500"
                            />
                        </div>

                        <div>
                            <p className="text-white font-bold text-sm mb-2">
                                Min Rating: <span className="text-blue-400">{minRating}★</span>
                            </p>
                            <input
                                type="range"
                                min="0"
                                max="5"
                                step="0.5"
                                value={minRating}
                                onChange={e => setMinRating(+e.target.value)}
                                className="w-full accent-blue-500"
                            />
                        </div>

                        <button
                            onClick={() => {
                                setQ('');
                                setCat('');
                                setMaxPrice(2000);
                                setMinRating(0);
                            }}
                            className="w-full text-gray-400 hover:text-white text-sm border border-gray-700 py-2 rounded-xl"
                        >
                            Reset Filters
                        </button>
                    </div>
                </aside> */}

                {/* PRODUCTS */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-3">

                        <div className="flex gap-2 flex-wrap">
                            {CATS.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setCat(cat === c ? '' : c)}
                                    className={`text-xs px-4 py-1.5 rounded-full font-semibold ${cat === c
                                        ? 'bg-blue-500 text-black'
                                        : 'bg-gray-700 text-gray-300'
                                        }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>

                        <select
                            value={sort}
                            onChange={e => setSort(e.target.value)}
                            className="bg-gray-800 text-gray-300 text-sm px-3 py-2 rounded-xl border border-gray-700"
                        >
                            <option value="featured">Featured</option>
                            <option value="price-asc">Price: Low → High</option>
                            <option value="price-desc">Price: High → Low</option>
                            <option value="rating">Top Rated</option>
                            <option value="discount">Best Deals</option>
                        </select>
                    </div>

                    {sorted.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            <p>No products found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {sorted.map(p => (
                                <ProductCard key={p.id} p={p} onAdd={onAdd} onNav={onNav} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ShopPage;