
/* ══════════════════════════════════════
   USER DASHBOARD
══════════════════════════════════════ */
function DashboardPage({ user, setUser, onNav }) {
    const [tab, setTab] = useState('profile');
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState(user?.name || '');
    if (!user) return (
        <div className="text-center py-24"><div className="text-6xl mb-5">🔒</div>
            <h2 className="text-2xl font-black text-white mb-3">Sign in to view dashboard</h2>
            <button onClick={() => onNav('login')} className="bg-blue-500 text-black font-black px-7 py-3 rounded-2xl mt-2">Sign In</button></div>
    );
    const tabs = [['profile', '👤 Profile'], ['orders', '📦 Orders'], ['wishlist', '❤️ Wishlist'], ['security', '🔒 Security']];
    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex items-center gap-5 mb-8 bg-gray-800 rounded-2xl p-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-black font-black text-2xl">{user.name[0]}</div>
                <div>
                    <h1 className="text-2xl font-black text-white">{user.name}</h1>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                    <Badge status={user.role === 'admin' ? 'Paid' : 'Processing'} />
                </div>
            </div>
            <div className="flex gap-2 mb-6 flex-wrap">
                {tabs.map(([t, l]) => (
                    <button key={t} onClick={() => setTab(t)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold ${tab === t ? 'bg-blue-500 text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`} style={{ transition: 'all .15s' }}>
                        {l}
                    </button>
                ))}
            </div>

            {tab === 'profile' && (
                <div className="bg-gray-800 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-white font-black text-xl">Profile Information</h2>
                        <button onClick={() => setEditMode(!editMode)} className="text-blue-400 text-sm hover:text-blue-300">{editMode ? 'Cancel' : '✏️ Edit'}</button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[['Name', editMode ? <input value={name} onChange={e => setName(e.target.value)}
                            className="bg-gray-700 text-white px-3 py-1.5 rounded-xl border border-gray-600 focus:outline-none focus:border-blue-500 text-sm w-full" /> : user.name],
                        ['Email', user.email], ['Account Type', <Badge status={user.role === 'admin' ? 'Paid' : 'Processing'} />], ['Member Since', 'January 2025'],
                        ['Total Orders', '3'], ['Total Spent', '$2,296']].map(([l, v]) => (
                            <div key={l} className="bg-gray-700/50 rounded-xl p-4">
                                <p className="text-gray-500 text-xs mb-1">{l}</p>
                                <div className="text-white text-sm font-semibold">{v}</div>
                            </div>
                        ))}
                    </div>
                    {editMode && <button onClick={() => { setUser({ ...user, name }); setEditMode(false); showToast?.('Profile updated!'); }} className="mt-5 bg-blue-500 hover:bg-blue-400 text-black font-black px-6 py-2.5 rounded-xl text-sm">Save Changes</button>}
                </div>
            )}

            {tab === 'orders' && (
                <div className="space-y-4">
                    <h2 className="text-white font-black text-xl mb-4">Order History</h2>
                    {MOCK_ORDERS.map(o => (
                        <div key={o.id} className="bg-gray-800 rounded-2xl p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="text-white font-black font-mono">{o.id}</p>
                                    <p className="text-gray-500 text-xs mt-0.5">{o.date} · {o.items} item(s)</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-blue-400 font-black text-lg mb-1">${o.total}</p>
                                    <Badge status={o.status} />
                                </div>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {o.products.map(p => <span key={p} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">{p}</span>)}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {tab === 'wishlist' && (
                <div className="text-center py-14 text-gray-500">
                    <div className="text-5xl mb-4">❤️</div>
                    <p className="font-semibold text-lg mb-1">Your wishlist is empty</p>
                    <p className="text-sm mb-5">Save products you love to your wishlist</p>
                    <button onClick={() => onNav('shop')} className="bg-blue-500 text-black font-black px-6 py-3 rounded-2xl">Browse Products</button>
                </div>
            )}

            {tab === 'security' && (
                <div className="bg-gray-800 rounded-2xl p-6 space-y-3">
                    <h2 className="text-white font-black text-xl mb-5">Security Settings</h2>
                    {[['🔑 Change Password', 'Update your account password', '→'], ['📱 Two-Factor Auth', 'Add an extra layer of security', 'Enable →'], ['🌐 Active Sessions', 'Manage devices signed into your account', 'View →'], ['🗑 Delete Account', 'Permanently delete your account', 'Delete →']].map(([t, d, a]) => (
                        <div key={t} className="flex items-center justify-between bg-gray-700/50 hover:bg-gray-700 rounded-2xl p-4" style={{ transition: 'background .15s' }}>
                            <div><p className="text-white font-semibold text-sm">{t}</p><p className="text-gray-500 text-xs">{d}</p></div>
                            <button className={`text-sm font-semibold ${a.includes('Delete') ? 'text-red-400 hover:text-red-300' : 'text-blue-400 hover:text-blue-300'}`} style={{ transition: 'color .15s' }}>{a}</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}