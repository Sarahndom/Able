import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Search, RefreshCw, Filter } from "lucide-react";

const STATUSES = ["Pending", "Processing", "Paid", "Shipped", "Delivered", "Cancelled"];

const STATUS_COLOR = (s) => {
    switch (s) {
        case 'Delivered': return 'text-green-400 bg-green-400/10 border-green-400/20';
        case 'Shipped': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
        case 'Processing': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
        case 'Pending': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
        case 'Paid': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
        case 'Cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
        default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
};

const MOCK_ORDERS = [
    { id: "ORD-7A3F9", customer_name: "John Smith", customer_email: "john@email.com", total: 1248, status: "Delivered", created_at: "2025-12-15", items_count: 2 },
    { id: "ORD-2B8D1", customer_name: "Sarah Johnson", customer_email: "sarah@email.com", total: 349, status: "Shipped", created_at: "2026-01-03", items_count: 1 },
    { id: "ORD-5C6E2", customer_name: "Mike Chen", customer_email: "mike@email.com", total: 699, status: "Processing", created_at: "2026-01-18", items_count: 1 },
    { id: "ORD-9D4H7", customer_name: "Emily Davis", customer_email: "emily@email.com", total: 249, status: "Pending", created_at: "2026-01-20", items_count: 1 },
    { id: "ORD-3E1K5", customer_name: "Alex Wilson", customer_email: "alex@email.com", total: 1099, status: "Paid", created_at: "2026-01-22", items_count: 1 },
    { id: "ORD-4F2L9", customer_name: "Maria Garcia", customer_email: "maria@email.com", total: 550, status: "Shipped", created_at: "2026-02-01", items_count: 3 },
    { id: "ORD-8G7M3", customer_name: "David Lee", customer_email: "david@email.com", total: 2100, status: "Processing", created_at: "2026-02-10", items_count: 2 },
];

export default function Orders({ showToast }) {
    const [orders, setOrders] = useState(MOCK_ORDERS);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("orders")
                .select("*")
                .order("created_at", { ascending: false });
            if (!error && data?.length) setOrders(data);
        } catch { /* use mock */ }
        finally { setLoading(false); }
    };

    const updateStatus = async (id, newStatus) => {
        setUpdatingId(id);
        try {
            const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", id);
            if (!error) showToast?.(`Status updated to ${newStatus}`);
            else showToast?.(`Status updated to ${newStatus} (locally)`);
        } catch { showToast?.(`Status updated to ${newStatus} (locally)`); }
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
        setUpdatingId(null);
    };

    const filtered = orders.filter(o => {
        const name = (o.customer_name || o.customer || "").toLowerCase();
        const id = (o.id || "").toLowerCase();
        const matchSearch = search === "" || name.includes(search.toLowerCase()) || id.includes(search.toLowerCase());
        const matchStatus = statusFilter === "All" || o.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const totalRevenue = filtered.reduce((s, o) => s + (o.total || 0), 0);

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
                        <input value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search orders or customers…"
                            className="bg-gray-800 text-white pl-8 pr-4 py-2 rounded-xl border border-gray-700 focus:outline-none focus:border-blue-500 text-sm w-60" />
                    </div>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                        className="bg-gray-800 text-white px-3 py-2 rounded-xl border border-gray-700 text-sm focus:outline-none focus:border-blue-500">
                        {["All", ...STATUSES].map(s => <option key={s}>{s}</option>)}
                    </select>
                </div>
                <button onClick={fetchOrders} className="flex items-center gap-2 text-gray-400 hover:text-white border border-gray-700 px-3 py-2 rounded-xl text-sm transition-all self-start">
                    <RefreshCw size={14} /> Refresh
                </button>
            </div>

            {/* Summary strip */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {["All", ...STATUSES].slice(0, 6).map(s => {
                    const count = s === "All" ? orders.length : orders.filter(o => o.status === s).length;
                    return (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`p-3 rounded-2xl text-center transition-all border ${statusFilter === s ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'}`}>
                            <p className="text-lg font-black">{count}</p>
                            <p className="text-[10px] uppercase font-bold opacity-70">{s}</p>
                        </button>
                    );
                })}
            </div>

            {/* Table */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700/50 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
                    <h3 className="text-white font-black text-base">
                        Orders <span className="text-gray-500 font-normal text-sm">({filtered.length})</span>
                    </h3>
                    <span className="text-blue-400 font-bold text-sm">
                        Total: ${totalRevenue.toLocaleString()}
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700 bg-gray-900/30">
                                {["Order ID", "Customer", "Items", "Total", "Status", "Date", "Update Status"].map(h => (
                                    <th key={h} className="text-left text-xs text-gray-500 font-bold uppercase px-5 py-3 whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(o => (
                                <tr key={o.id} className="border-b border-gray-700/40 hover:bg-gray-700/20 transition-colors">
                                    <td className="px-5 py-3 text-blue-400 font-mono text-sm whitespace-nowrap">{o.id}</td>
                                    <td className="px-5 py-3">
                                        <p className="text-white text-sm font-semibold">{o.customer_name || o.customer}</p>
                                        <p className="text-gray-500 text-xs">{o.customer_email || o.email}</p>
                                    </td>
                                    <td className="px-5 py-3 text-gray-400 text-sm">{o.items_count || o.items || 1} item(s)</td>
                                    <td className="px-5 py-3 text-white font-bold text-sm">${(o.total || 0).toLocaleString()}</td>
                                    <td className="px-5 py-3">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full border ${STATUS_COLOR(o.status)}`}>{o.status}</span>
                                    </td>
                                    <td className="px-5 py-3 text-gray-400 text-sm whitespace-nowrap">
                                        {new Date(o.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-5 py-3">
                                        <select
                                            value={o.status}
                                            disabled={updatingId === o.id}
                                            onChange={e => updateStatus(o.id, e.target.value)}
                                            className="bg-gray-700 text-white text-xs px-2 py-1.5 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 cursor-pointer disabled:opacity-50"
                                        >
                                            {STATUSES.map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="text-center py-16 text-gray-500">
                            <Filter size={40} className="mx-auto mb-3 opacity-30" />
                            <p>No orders match your filters</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}