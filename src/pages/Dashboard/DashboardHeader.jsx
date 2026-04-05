import React from "react";
import { Sun, Moon } from "lucide-react";

export default function DashboardHeader({ displayName, initials, email, createdAt, isDark, setIsDark }) {

    return (

        <div className={`rounded-3xl p-6 sm:p-8 mb-8 border relative overflow-hidden ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 relative">

                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-white text-2xl sm:text-3xl shadow-xl shadow-blue-600/30 flex-shrink-0">
                    {initials}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-xl sm:text-2xl font-black truncate">{displayName}</h1>
                        <span className="bg-blue-600/10 text-blue-400 text-xs font-black px-2.5 py-1 rounded-full border border-blue-600/20">
                            ✓ Verified Member
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
                    <p className="text-gray-600 text-xs mt-1">
                        Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : '—'}
                    </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-center">
                    <button onClick={() => setIsDark(!isDark)}
                        className={`p-2.5 rounded-xl border transition-all ${isDark ? 'bg-gray-800 border-gray-700 text-blue-400' : 'bg-gray-100 border-gray-200 text-blue-600'}`}>
                        {isDark ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                </div>
            </div>
        </div>

    )

}
