import { useState } from "react";
import { PRODUCTS } from "../data/products";
import Badge from "../components/ui/Badge";

function AdminPage({ onNav }) {
    const [tab, setTab] = useState("overview");
    const [prods, setProds] = useState(PRODUCTS);

    const [orders, setOrders] = useState([
        { id: "ORD-7A3F9", customer: "John Smith", total: 1248, status: "Delivered", date: "2024-12-15", items: 2 },
        { id: "ORD-2B8D1", customer: "Sarah Johnson", total: 349, status: "Shipped", date: "2025-01-03", items: 1 },
        { id: "ORD-5C6E2", customer: "Mike Chen", total: 699, status: "Processing", date: "2025-01-18", items: 1 },
        { id: "ORD-9D4H7", customer: "Emily Davis", total: 249, status: "Pending", date: "2025-01-20", items: 1 },
        { id: "ORD-3E1K5", customer: "Alex Wilson", total: 1099, status: "Paid", date: "2025-01-22", items: 1 },
    ]);

    const revenue = orders.reduce((sum, o) => sum + o.total, 0);

    const tabs = [
        ["overview", "📊 Overview"],
        ["products", "🏪 Products"],
        ["orders", "📦 Orders"],
        ["users", "👥 Users"],
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-black text-white">Admin Dashboard</h1>
                    <p className="text-gray-500 text-sm">Manage ElectroStore</p>
                </div>
                <span className="bg-yellow-500/20 text-yellow-400 text-xs font-black px-3 py-1.5 rounded-full">
                    ⚡ ADMIN
                </span>
            </div>

            {/* TABS */}
            <div className="flex gap-2 mb-7 flex-wrap">
                {tabs.map(([t, label]) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold ${tab === t
                                ? "bg-yellow-500 text-black"
                                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* OVERVIEW */}
            {tab === "overview" && (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            ["💰 Revenue", "$" + revenue.toLocaleString()],
                            ["📦 Orders", orders.length],
                            ["🏪 Products", prods.length],
                            ["👥 Customers", "1,247"],
                        ].map(([label, value]) => (
                            <div key={label} className="bg-gray-800 p-5 rounded-2xl">
                                <p className="text-gray-400 text-sm">{label}</p>
                                <p className="text-2xl font-black text-yellow-400">{value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* PRODUCTS */}
            {tab === "products" && (
                <div className="bg-gray-800 rounded-2xl p-6">
                    <h3 className="text-white font-black mb-4">Products</h3>

                    {prods.map((p) => (
                        <div
                            key={p.id}
                            className="flex justify-between items-center border-b border-gray-700 py-3"
                        >
                            <span className="text-white">{p.name}</span>

                            <div className="flex gap-3 items-center">
                                <Badge status={p.stock > 0 ? "In Stock" : "Out of Stock"} />

                                <button
                                    onClick={() =>
                                        setProds((prev) =>
                                            prev.filter((item) => item.id !== p.id)
                                        )
                                    }
                                    className="text-red-400 text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ORDERS */}
            {tab === "orders" && (
                <div className="bg-gray-800 rounded-2xl p-6">
                    <h3 className="text-white font-black mb-4">Orders</h3>

                    {orders.map((o) => (
                        <div
                            key={o.id}
                            className="flex justify-between items-center border-b border-gray-700 py-3"
                        >
                            <span className="text-white">{o.customer}</span>

                            <div className="flex gap-3 items-center">
                                <Badge status={o.status} />

                                <select
                                    value={o.status}
                                    onChange={(e) =>
                                        setOrders((prev) =>
                                            prev.map((x) =>
                                                x.id === o.id
                                                    ? { ...x, status: e.target.value }
                                                    : x
                                            )
                                        )
                                    }
                                    className="bg-gray-700 text-white text-sm px-2 py-1 rounded"
                                >
                                    {["Pending", "Processing", "Shipped", "Delivered"].map(
                                        (s) => (
                                            <option key={s}>{s}</option>
                                        )
                                    )}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* USERS */}
            {tab === "users" && (
                <div className="bg-gray-800 rounded-2xl p-6">
                    <h3 className="text-white font-black mb-4">Users</h3>

                    {["John", "Sarah", "Mike"].map((u) => (
                        <div
                            key={u}
                            className="border-b border-gray-700 py-3 text-white"
                        >
                            {u}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminPage;