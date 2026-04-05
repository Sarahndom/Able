import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { PRODUCTS } from "../data/products";
import {
    DollarSign, ShoppingCart, Package, Users,
    TrendingUp, ArrowRight, Clock
} from "lucide-react";

const STATUS_COLOR = (s) => {
    switch (s) {
        case 'Delivered': return 'text-green-400 bg-green-400/10 border-green-400/20';
        case 'Shipped': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
        case 'Processing': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
        case 'Pending': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
        case 'Paid': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
        default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
};

const MOCK_ORDERS = [
    { id: "ORD-7A3F9", customer_name: "John Smith", total: 1248, status: "Delivered", created_at: "2025-12-15", items: 2 },
    { id: "ORD-2B8D1", customer_name: "Sarah Johnson", total: 349, status: "Shipped", created_at: "2026-01-03", items: 1 },
    { id: "ORD-5C6E2", customer_name: "Mike Chen", total: 699, status: "Processing", created_at: "2026-01-18", items: 1 },
    { id: "ORD-9D4H7", customer_name: "Emily Davis", total: 249, status: "Pending", created_at: "2026-01-20", items: 1 },
    { id: "ORD-3E1K5", customer_name: "Alex Wilson", total: 1099, status: "Paid", created_at: "2026-01-22", items: 1 },
];

export default function Dashboard({ onTabChange }) {
    const [orders, setOrders] = useState(MOCK_ORDERS);
    const [prods, setProds] = useState(PRODUCTS);
    const [userCount, setUserCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [ordersRes, usersRes, prodsRes] = await Promise.all([
                supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
                supabase.from("profiles").select("id").eq("deleted", false),
                supabase.from("products").select("*"),
            ]);
            if (ordersRes.data?.length) setOrders(ordersRes.data);
            if (usersRes.data) setUserCount(usersRes.data.length);
            if (prodsRes.data?.length) setProds(prodsRes.data);
        } catch { /* use defaults */ }
        finally { setLoading(false); }
    };

    const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    const pending = orders.filter(o => o.status === "Pending").length;
    const inStock = prods.filter(p => p.stock > 0).length;

    if (loading) return (
        <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6">

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Revenue", value: `$${revenue.toLocaleString()}`, sub: "All time", icon: <DollarSign size={20} />, color: "blue" },
                    { label: "Total Orders", value: orders.length, sub: `${pending} pending`, icon: <ShoppingCart size={20} />, color: "purple" },
                    { label: "Products", value: prods.length, sub: `${inStock} in stock`, icon: <Package size={20} />, color: "green" },
                    { label: "Customers", value: userCount || "1,247", sub: "+12 this month", icon: <Users size={20} />, color: "orange" },
                ].map(({ label, value, sub, icon, color }) => (
                    <div key={label} className="bg-gray-800 rounded-2xl p-5 border border-gray-700/50">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
                            color === 'purple' ? 'bg-purple-500/10 text-purple-400' :
                                color === 'green' ? 'bg-green-500/10 text-green-400' :
                                    'bg-orange-500/10 text-orange-400'
                            }`}>{icon}</div>
                        <p className="text-gray-400 text-xs mb-1">{label}</p>
                        <p className="text-2xl font-black text-white">{value}</p>
                        <p className="text-gray-500 text-xs mt-1">{sub}</p>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700/50 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-blue-400" />
                        <h3 className="text-white font-black text-base">Recent Orders</h3>
                    </div>
                    <button
                        onClick={() => onTabChange("orders")}
                        className="flex items-center gap-1 text-blue-400 text-sm hover:text-blue-300 transition-colors"
                    >
                        View all <ArrowRight size={14} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700">
                                {["Order ID", "Customer", "Total", "Status", "Date"].map(h => (
                                    <th key={h} className="text-left text-xs text-gray-500 font-bold uppercase px-6 py-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {orders.slice(0, 5).map(o => (
                                <tr key={o.id} className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors">
                                    <td className="px-6 py-3 text-blue-400 font-mono text-sm">{o.id}</td>
                                    <td className="px-6 py-3 text-white text-sm">{o.customer_name || o.customer}</td>
                                    <td className="px-6 py-3 text-white font-bold text-sm">${(o.total || 0).toLocaleString()}</td>
                                    <td className="px-6 py-3">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full border ${STATUS_COLOR(o.status)}`}>{o.status}</span>
                                    </td>
                                    <td className="px-6 py-3 text-gray-400 text-sm">
                                        {new Date(o.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Top Products */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700/50 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
                    <div className="flex items-center gap-2">
                        <TrendingUp size={16} className="text-blue-400" />
                        <h3 className="text-white font-black text-base">Top Products</h3>
                    </div>
                    <button
                        onClick={() => onTabChange("products")}
                        className="flex items-center gap-1 text-blue-400 text-sm hover:text-blue-300 transition-colors"
                    >
                        View all <ArrowRight size={14} />
                    </button>
                </div>
                <div className="divide-y divide-gray-700/50">
                    {prods.slice(0, 6).map((p, i) => (
                        <div key={p.id} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-700/20 transition-colors">
                            <span className="text-gray-600 text-sm w-5 text-right font-bold">{i + 1}</span>
                            <img
                                src={p.img}
                                alt={p.name}
                                className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                                onError={e => e.target.src = 'https://placehold.co/40x40/1f2937/6b7280'}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-semibold truncate">{p.name}</p>
                                <p className="text-gray-500 text-xs">{p.cat || p.category}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="text-blue-400 font-bold text-sm">${p.price}</p>
                                <p className={`text-xs ${(p.stock || 0) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {(p.stock || 0) > 0 ? `${p.stock} left` : 'Out of stock'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}