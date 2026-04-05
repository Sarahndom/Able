import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { PRODUCTS } from "../data/products";
import {
    Plus, Trash2, Edit2, Check, X, Search,
    Star, Package, Upload, RefreshCw, Save
} from "lucide-react";

const EMPTY_FORM = {
    name: "", brand: "", cat: "TVs", price: "", orig: "",
    disc: 0, stock: "", rating: 4.5, reviews: 0,
    desc: "", img: "", sku: ""
};

const CATS = ["TVs", "Phones", "Accessories"];

export default function Products({ showToast }) {
    const [prods, setProds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [catFilter, setCatFilter] = useState("All");
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [addForm, setAddForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchProducts(); }, []);

    // ── Fetch (Supabase or fallback) ──
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
            if (error || !data?.length) {
                setProds(PRODUCTS); // fallback to local data
            } else {
                setProds(data);
            }
        } catch {
            setProds(PRODUCTS);
        } finally { setLoading(false); }
    };

    // ── Add product ──
    const handleAdd = async () => {
        if (!addForm.name || !addForm.price) return showToast?.("Name and price are required", "error");
        setSaving(true);
        const newProd = {
            ...addForm,
            price: parseFloat(addForm.price),
            orig: parseFloat(addForm.orig) || parseFloat(addForm.price),
            stock: parseInt(addForm.stock) || 0,
            rating: parseFloat(addForm.rating) || 4.5,
            reviews: parseInt(addForm.reviews) || 0,
            disc: parseInt(addForm.disc) || 0,
            sku: addForm.sku || `SKU-${Date.now()}`,
            id: addForm.id || `local-${Date.now()}`,
        };

        try {
            const { data, error } = await supabase.from("products").insert([newProd]).select().single();
            if (!error && data) {
                setProds(prev => [data, ...prev]);
                showToast?.("Product added successfully!");
            } else {
                // local fallback
                setProds(prev => [newProd, ...prev]);
                showToast?.("Product added (locally)!");
            }
        } catch {
            setProds(prev => [newProd, ...prev]);
            showToast?.("Product added (locally)!");
        }
        setShowAddModal(false);
        setAddForm(EMPTY_FORM);
        setSaving(false);
    };

    // ── Start edit ──
    const startEdit = (p) => {
        setEditingId(p.id);
        setEditForm({ ...p });
    };

    // ── Save edit ──
    const saveEdit = async () => {
        setSaving(true);
        const updated = {
            ...editForm,
            price: parseFloat(editForm.price),
            orig: parseFloat(editForm.orig) || parseFloat(editForm.price),
            stock: parseInt(editForm.stock) || 0,
        };
        try {
            const { error } = await supabase.from("products").update(updated).eq("id", editingId);
            if (!error) showToast?.("Product updated!");
            else showToast?.("Updated locally!");
        } catch { showToast?.("Updated locally!"); }
        setProds(prev => prev.map(p => p.id === editingId ? updated : p));
        setEditingId(null);
        setSaving(false);
    };

    // ── Delete ──
    const handleDelete = async (id) => {
        try {
            await supabase.from("products").delete().eq("id", id);
        } catch { }
        setProds(prev => prev.filter(p => p.id !== id));
        setConfirmDelete(null);
        showToast?.("Product removed", "error");
    };

    // ── Filter ──
    const filtered = prods.filter(p => {
        const matchSearch = search === "" || p.name?.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase());
        const matchCat = catFilter === "All" || p.cat === catFilter || p.category === catFilter;
        return matchSearch && matchCat;
    });

    if (loading) return (
        <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-5">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <div className="flex gap-2 flex-wrap">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search products…"
                            className="bg-gray-800 text-white pl-8 pr-4 py-2 rounded-xl border border-gray-700 focus:outline-none focus:border-blue-500 text-sm w-52"
                        />
                    </div>
                    <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
                        className="bg-gray-800 text-white px-3 py-2 rounded-xl border border-gray-700 text-sm focus:outline-none focus:border-blue-500">
                        {["All", ...CATS].map(c => <option key={c}>{c}</option>)}
                    </select>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchProducts} className="flex items-center gap-2 text-gray-400 hover:text-white border border-gray-700 px-3 py-2 rounded-xl text-sm transition-all">
                        <RefreshCw size={14} />
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
                    >
                        <Plus size={16} /> Add Product
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700/50 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
                    <h3 className="text-white font-black text-base">
                        Products <span className="text-gray-500 font-normal text-sm">({filtered.length})</span>
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700 bg-gray-900/30">
                                {["Product", "Category", "Price", "Stock", "Rating", "Actions"].map(h => (
                                    <th key={h} className="text-left text-xs text-gray-500 font-bold uppercase px-5 py-3 whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(p => (
                                <tr key={p.id} className="border-b border-gray-700/40 hover:bg-gray-700/20 transition-colors">
                                    {editingId === p.id ? (
                                        /* Inline edit row */
                                        <>
                                            <td className="px-5 py-2" colSpan={4}>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <input value={editForm.name || ""} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                                                        placeholder="Name" className="bg-gray-900 text-white px-3 py-1.5 rounded-lg border border-gray-600 text-sm focus:outline-none focus:border-blue-500" />
                                                    <input value={editForm.brand || ""} onChange={e => setEditForm(f => ({ ...f, brand: e.target.value }))}
                                                        placeholder="Brand" className="bg-gray-900 text-white px-3 py-1.5 rounded-lg border border-gray-600 text-sm focus:outline-none focus:border-blue-500" />
                                                    <input value={editForm.price || ""} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))}
                                                        placeholder="Price" type="number" className="bg-gray-900 text-white px-3 py-1.5 rounded-lg border border-gray-600 text-sm focus:outline-none focus:border-blue-500" />
                                                    <input value={editForm.stock || ""} onChange={e => setEditForm(f => ({ ...f, stock: e.target.value }))}
                                                        placeholder="Stock" type="number" className="bg-gray-900 text-white px-3 py-1.5 rounded-lg border border-gray-600 text-sm focus:outline-none focus:border-blue-500" />
                                                    <input value={editForm.img || ""} onChange={e => setEditForm(f => ({ ...f, img: e.target.value }))}
                                                        placeholder="Image URL" className="bg-gray-900 text-white px-3 py-1.5 rounded-lg border border-gray-600 text-sm focus:outline-none focus:border-blue-500 col-span-2" />
                                                    <textarea value={editForm.desc || ""} onChange={e => setEditForm(f => ({ ...f, desc: e.target.value }))}
                                                        placeholder="Description" rows={2} className="bg-gray-900 text-white px-3 py-1.5 rounded-lg border border-gray-600 text-sm focus:outline-none focus:border-blue-500 col-span-2 resize-none" />
                                                </div>
                                            </td>
                                            <td className="px-5 py-2" />
                                            <td className="px-5 py-2">
                                                <div className="flex gap-2">
                                                    <button onClick={saveEdit} disabled={saving}
                                                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50">
                                                        <Save size={12} /> Save
                                                    </button>
                                                    <button onClick={() => setEditingId(null)}
                                                        className="p-1.5 bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors">
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        /* Normal row */
                                        <>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    <img src={p.img} alt={p.name}
                                                        className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                                                        onError={e => e.target.src = 'https://placehold.co/40x40/1f2937/6b7280'} />
                                                    <div>
                                                        <p className="text-white text-sm font-semibold max-w-[160px] truncate">{p.name}</p>
                                                        <p className="text-gray-500 text-xs">{p.brand}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">{p.cat || p.category}</span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <p className="text-blue-400 font-bold text-sm">${p.price}</p>
                                                {p.orig > p.price && <p className="text-gray-500 text-xs line-through">${p.orig}</p>}
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className={`text-xs font-bold ${(p.stock || 0) > 5 ? 'text-green-400' : (p.stock || 0) > 0 ? 'text-blue-400' : 'text-red-400'}`}>
                                                    {(p.stock || 0) > 0 ? `${p.stock} units` : 'Out of stock'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-1">
                                                    <Star size={11} className="text-blue-400 fill-blue-400" />
                                                    <span className="text-white text-xs">{p.rating}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                {confirmDelete === p.id ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-red-400 text-xs font-bold">Delete?</span>
                                                        <button onClick={() => handleDelete(p.id)}
                                                            className="p-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                                                            <Check size={12} />
                                                        </button>
                                                        <button onClick={() => setConfirmDelete(null)}
                                                            className="p-1 bg-gray-700 text-gray-400 rounded-lg hover:bg-gray-600 transition-all">
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => startEdit(p)}
                                                            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs transition-colors p-1.5 hover:bg-blue-400/10 rounded-lg">
                                                            <Edit2 size={12} /> Edit
                                                        </button>
                                                        <button onClick={() => setConfirmDelete(p.id)}
                                                            className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs transition-colors p-1.5 hover:bg-red-400/10 rounded-lg">
                                                            <Trash2 size={12} /> Del
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="text-center py-16 text-gray-500">
                            <Package size={40} className="mx-auto mb-3 opacity-30" />
                            <p>No products found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ADD PRODUCT MODAL */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-3xl w-full max-w-xl p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-white font-black text-xl">Add New Product</h2>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">
                                <X size={22} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-1">
                            {[
                                { key: "name", label: "Product Name *", placeholder: "e.g. Samsung 65\" QLED TV", span: 2 },
                                { key: "brand", label: "Brand", placeholder: "e.g. Samsung" },
                                { key: "sku", label: "SKU", placeholder: "e.g. SAM-65-Q80" },
                                { key: "price", label: "Price ($) *", placeholder: "e.g. 799.99", type: "number" },
                                { key: "orig", label: "Original Price ($)", placeholder: "e.g. 999.99", type: "number" },
                                { key: "stock", label: "Stock", placeholder: "e.g. 50", type: "number" },
                                { key: "disc", label: "Discount (%)", placeholder: "e.g. 20", type: "number" },
                            ].map(({ key, label, placeholder, span, type }) => (
                                <div key={key} className={span === 2 ? "col-span-2" : ""}>
                                    <label className="text-gray-400 text-xs block mb-1">{label}</label>
                                    <input
                                        type={type || "text"} value={addForm[key]} placeholder={placeholder}
                                        onChange={e => setAddForm(f => ({ ...f, [key]: e.target.value }))}
                                        className="w-full bg-black text-white px-3 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:border-blue-500 text-sm"
                                    />
                                </div>
                            ))}

                            {/* Category */}
                            <div>
                                <label className="text-gray-400 text-xs block mb-1">Category</label>
                                <select value={addForm.cat} onChange={e => setAddForm(f => ({ ...f, cat: e.target.value }))}
                                    className="w-full bg-black text-white px-3 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:border-blue-500 text-sm">
                                    {CATS.map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>

                            {/* Rating */}
                            <div>
                                <label className="text-gray-400 text-xs block mb-1">Rating (0–5)</label>
                                <input type="number" min="0" max="5" step="0.1" value={addForm.rating}
                                    onChange={e => setAddForm(f => ({ ...f, rating: e.target.value }))}
                                    className="w-full bg-black text-white px-3 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:border-blue-500 text-sm" />
                            </div>

                            {/* Image URL */}
                            <div className="col-span-2">
                                <label className="text-gray-400 text-xs block mb-1">Image URL</label>
                                <input value={addForm.img} onChange={e => setAddForm(f => ({ ...f, img: e.target.value }))}
                                    placeholder="https://…"
                                    className="w-full bg-black text-white px-3 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:border-blue-500 text-sm" />
                                {addForm.img && (
                                    <img src={addForm.img} alt="preview"
                                        className="mt-2 w-20 h-20 rounded-xl object-cover border border-gray-700"
                                        onError={e => e.target.style.display = 'none'} />
                                )}
                            </div>

                            {/* Description */}
                            <div className="col-span-2">
                                <label className="text-gray-400 text-xs block mb-1">Description</label>
                                <textarea rows={3} value={addForm.desc} onChange={e => setAddForm(f => ({ ...f, desc: e.target.value }))}
                                    placeholder="Product description…"
                                    className="w-full bg-black text-white px-3 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:border-blue-500 text-sm resize-none" />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => { setShowAddModal(false); setAddForm(EMPTY_FORM); }}
                                className="flex-1 border border-gray-700 text-gray-400 hover:text-white py-3 rounded-2xl text-sm transition-all">
                                Cancel
                            </button>
                            <button onClick={handleAdd} disabled={saving}
                                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-black py-3 rounded-2xl text-sm transition-all flex items-center justify-center gap-2">
                                {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</> : <><Plus size={16} /> Add Product</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}