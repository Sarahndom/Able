import React from "react";
import { User, Mail, Phone, MapPin, Edit2, Save, LogOut } from "lucide-react";

export default function ProfileTab({
    isDark, editMode, setEditMode, editForm, setEditForm, profile,
    user, loadingProfile, savingProfile, saveProfile, handleSignOut
}) {

    return (
        // {activeTab === "profile" && (
        <div className={`rounded-3xl border p-6 sm:p-8 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-black">Profile Information</h2>
                {!editMode ? (
                    <button onClick={() => setEditMode(true)}
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-bold transition-colors">
                        <Edit2 size={14} /> Edit Profile
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button onClick={() => { setEditMode(false); setEditForm({ full_name: profile.full_name, phone: profile.phone, address: profile.address }); }}
                            className="text-gray-500 hover:text-white text-sm border border-gray-700 px-3 py-1.5 rounded-xl transition-all">
                            Cancel
                        </button>
                        <button onClick={saveProfile} disabled={savingProfile}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-black px-4 py-1.5 rounded-xl transition-all">
                            {savingProfile ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                            Save
                        </button>
                    </div>
                )}
            </div>

            {loadingProfile ? (
                <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        {
                            label: "Full Name", icon: <User size={14} />, key: "full_name",
                            value: profile?.full_name, editable: true,
                        },
                        {
                            label: "Email Address", icon: <Mail size={14} />,
                            value: user?.email, editable: false,
                            note: "Contact support to change your email"
                        },
                        {
                            label: "Phone Number", icon: <Phone size={14} />, key: "phone",
                            value: profile?.phone || "—", editable: true,
                            placeholder: "+1 (555) 000-0000"
                        },
                        {
                            label: "Delivery Address", icon: <MapPin size={14} />, key: "address",
                            value: profile?.address || "—", editable: true,
                            placeholder: "123 Main St, City, Country",
                            span: true
                        },
                    ].map(({ label, icon, key, value, editable, note, placeholder, span }) => (
                        <div key={label} className={`${span ? 'sm:col-span-2' : ''} ${isDark ? 'bg-gray-800/60 border-gray-700' : 'bg-gray-50 border-gray-200'} rounded-2xl p-4 border`}>
                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                {icon}
                                <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
                            </div>
                            {editMode && editable ? (
                                <input
                                    value={editForm[key] || ""}
                                    onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))}
                                    placeholder={placeholder}
                                    className={`w-full bg-transparent text-sm font-semibold outline-none border-b pb-1 transition-colors ${isDark ? 'text-white border-gray-600 focus:border-blue-500' : 'text-gray-900 border-gray-300 focus:border-blue-500'}`}
                                />
                            ) : (
                                <>
                                    <p className={`text-sm font-semibold ${(!value || value === "—") ? 'text-gray-500 italic' : ''}`}>
                                        {value || "Not set"}
                                    </p>
                                    {note && <p className="text-gray-600 text-[10px] mt-1">{note}</p>}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Sign out */}
            <div className="mt-8 pt-6 border-t border-gray-800">
                <button onClick={handleSignOut}
                    className="flex items-center gap-2 text-gray-500 hover:text-red-400 text-sm font-semibold transition-colors">
                    <LogOut size={16} /> Sign Out
                </button>
            </div>
        </div>
        // )}

    )

}