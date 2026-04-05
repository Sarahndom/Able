import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Search, RefreshCw, UserX, UserCheck, Mail, Users } from "lucide-react";

const MOCK_USERS = [
    { id: "1", full_name: "John Smith", email: "john@email.com", deleted: false, created_at: "2025-12-01", orders_count: 3, total_spent: 1248 },
    { id: "2", full_name: "Sarah Johnson", email: "sarah@email.com", deleted: false, created_at: "2026-01-03", orders_count: 1, total_spent: 349 },
    { id: "3", full_name: "Mike Chen", email: "mike@email.com", deleted: false, created_at: "2026-01-18", orders_count: 2, total_spent: 699 },
    { id: "4", full_name: "Emily Davis", email: "emily@email.com", deleted: false, created_at: "2026-01-20", orders_count: 1, total_spent: 249 },
    { id: "5", full_name: "Alex Wilson", email: "alex@email.com", deleted: true, created_at: "2026-01-22", orders_count: 0, total_spent: 0 },
];

export default function UsersTab({ showToast }) {
    const [users, setUsers] = useState(MOCK_USERS);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All"); // All | Active | Deleted
    const [actionId, setActionId] = useState(null);

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .order("created_at", { ascending: false });
            if (!error && data?.length) setUsers(data);
        } catch { /* use mock */ }
        finally { setLoading(false); }
    };

    // Ban (soft delete) user
    const banUser = async (id) => {
        setActionId(id);
        try {
            const { error } = await supabase.from("profiles").update({ deleted: true }).eq("id", id);
            if (!error) showToast?.("User suspended", "error");
            else showToast?.("User suspended (locally)", "error");
        } catch { showToast?.("User suspended (locally)", "error"); }
        setUsers(prev => prev.map(u => u.id === id ? { ...u, deleted: true } : u));
        setActionId(null);
    };

    // Restore user
    const restoreUser = async (id) => {
        setActionId(id);
        try {
            const { error } = await supabase.from("profiles").update({ deleted: false }).eq("id", id);
            if (!error) showToast?.("User restored!");
            else showToast?.("User restored (locally)!");
        } catch { showToast?.("User restored (locally)!"); }
        setUsers(prev => prev.map(u => u.id === id ? { ...u, deleted: false } : u));
        setActionId(null);
    };

    const filtered = users.filter(u => {
        const name = (u.full_name || "").toLowerCase();
        const email = (u.email || "").toLowerCase();
        const matchSearch = search === "" || name.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
        const matchFilter = filter === "All" || (filter === "Active" && !u.deleted) || (filter === "Deleted" && u.deleted);
        return matchSearch && matchFilter;
    });

    const activeCount = users.filter(u => !u.deleted).length;
    const deletedCount = users.filter(u => u.deleted).length;

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
                            placeholder="Search users…"
                            className="bg-gray-800 text-white pl-8 pr-4 py-2 rounded-xl border border-gray-700 focus:outline-none focus:border-blue-500 text-sm w-52" />
                    </div>
                    <div className="flex rounded-xl overflow-hidden border border-gray-700">
                        {["All", "Active", "Deleted"].map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`px-4 py-2 text-sm font-semibold transition-all ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
                <button onClick={fetchUsers} className="flex items-center gap-2 text-gray-400 hover:text-white border border-gray-700 px-3 py-2 rounded-xl text-sm transition-all self-start">
                    <RefreshCw size={14} /> Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Total Users", value: users.length, color: "text-white" },
                    { label: "Active", value: activeCount, color: "text-green-400" },
                    { label: "Suspended", value: deletedCount, color: "text-red-400" },
                ].map(({ label, value, color }) => (
                    <div key={label} className="bg-gray-800 rounded-2xl p-4 border border-gray-700/50 text-center">
                        <p className={`text-2xl font-black ${color}`}>{value}</p>
                        <p className="text-gray-500 text-xs mt-1">{label}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700/50 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
                    <div className="flex items-center gap-2">
                        <Users size={16} className="text-blue-400" />
                        <h3 className="text-white font-black text-base">
                            Users <span className="text-gray-500 font-normal text-sm">({filtered.length})</span>
                        </h3>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700 bg-gray-900/30">
                                {["User", "Email", "Orders", "Total Spent", "Joined", "Status", "Action"].map(h => (
                                    <th key={h} className="text-left text-xs text-gray-500 font-bold uppercase px-5 py-3 whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(u => (
                                <tr key={u.id} className={`border-b border-gray-700/40 transition-colors ${u.deleted ? 'opacity-50' : 'hover:bg-gray-700/20'}`}>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-blue-600/20 rounded-full flex items-center justify-center font-black text-blue-400 text-sm flex-shrink-0">
                                                {(u.full_name || u.email || "?")[0].toUpperCase()}
                                            </div>
                                            <p className="text-white text-sm font-semibold">{u.full_name || "—"}</p>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                                            <Mail size={12} />
                                            {u.email}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-white text-sm">{u.orders_count ?? "—"}</td>
                                    <td className="px-5 py-3 text-blue-400 font-bold text-sm">
                                        {u.total_spent ? `$${u.total_spent.toLocaleString()}` : "—"}
                                    </td>
                                    <td className="px-5 py-3 text-gray-400 text-sm whitespace-nowrap">
                                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full border ${u.deleted ? 'text-red-400 bg-red-400/10 border-red-400/20' : 'text-green-400 bg-green-400/10 border-green-400/20'}`}>
                                            {u.deleted ? "Suspended" : "Active"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3">
                                        {u.email === 'admin@ableenterprise.com' ? (
                                            <span className="text-xs text-gray-600 italic">Admin</span>
                                        ) : u.deleted ? (
                                            <button
                                                onClick={() => restoreUser(u.id)}
                                                disabled={actionId === u.id}
                                                className="flex items-center gap-1 text-green-400 hover:text-green-300 text-xs transition-colors p-1.5 hover:bg-green-400/10 rounded-lg disabled:opacity-50"
                                            >
                                                <UserCheck size={13} /> Restore
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => banUser(u.id)}
                                                disabled={actionId === u.id}
                                                className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs transition-colors p-1.5 hover:bg-red-400/10 rounded-lg disabled:opacity-50"
                                            >
                                                <UserX size={13} /> Suspend
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="text-center py-16 text-gray-500">
                            <Users size={40} className="mx-auto mb-3 opacity-30" />
                            <p>No users found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}