import React, { useEffect } from "react";
import AccountSettings from "./AccountSettings";
import PlaybackSettings from "./PlaybackSettings";
import { Moon, Shield, Play, Sun } from "lucide-react";

function SettingsPage({ isDark, setIsDark }) {
    // Sync theme to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("app_theme", isDark ? "dark" : "light");
    }, [isDark]);

    return (
        <div className={`min-h-screen pt-20 pb-12 transition-colors duration-300 ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="max-w-4xl mx-auto px-6">
                <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-10">Settings</h1>

                <div className="space-y-8">
                    {/* VISUALS */}
                    <section className={`${isDark ? 'bg-gray-900/40 border-gray-800' : 'bg-white border-gray-200'} border rounded-3xl p-8 shadow-sm`}>
                        <div className="flex items-center gap-3 mb-6">
                            {isDark ? <Moon className="text-[#0066FF]" size={20} /> : <Sun className="text-[#0066FF]" size={20} />}
                            <h2 className="text-xs font-black uppercase tracking-widest text-gray-500">Visuals</h2>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-bold">System Theme</p>
                                <p className="text-xs text-gray-500">Currently set to {isDark ? 'Dark' : 'Light'} Mode</p>
                            </div>
                            <button
                                onClick={() => setIsDark(!isDark)}
                                className={`w-14 h-7 rounded-full relative transition-all duration-300 ${isDark ? 'bg-[#0066FF]' : 'bg-gray-300'}`}
                            >
                                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${isDark ? 'left-8' : 'left-1 shadow-md'}`} />
                            </button>
                        </div>
                    </section>

                    {/* ACCOUNT & SECURITY */}
                    <section className={`${isDark ? 'bg-gray-900/40 border-gray-800' : 'bg-white border-gray-200'} border rounded-3xl p-8 shadow-sm`}>
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="text-[#0066FF]" size={20} />
                            <h2 className="text-xs font-black uppercase tracking-widest text-gray-500">Account & Security</h2>
                        </div>
                        <AccountSettings isDark={isDark} />
                    </section>

                    {/* MEDIA PLAYBACK */}
                    <section className={`${isDark ? 'bg-gray-900/40 border-gray-800' : 'bg-white border-gray-200'} border rounded-3xl p-8 shadow-sm`}>
                        <div className="flex items-center gap-3 mb-6">
                            <Play className="text-[#0066FF]" size={20} />
                            <h2 className="text-xs font-black uppercase tracking-widest text-gray-500">Media Playback</h2>
                        </div>
                        <PlaybackSettings isDark={isDark} />
                    </section>
                </div>
            </div>
        </div>
    );
}
export default SettingsPage;