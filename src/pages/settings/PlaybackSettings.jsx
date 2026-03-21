import React, { useState, useEffect } from "react";
import { Monitor, PlayCircle, ChevronRight, Captions } from "lucide-react";

export default function PlaybackSettings({ isDark }) {
    const [quality, setQuality] = useState(() => localStorage.getItem("app_quality") || "HD");
    const [autoplay, setAutoplay] = useState(() => localStorage.getItem("app_autoplay") !== "false");
    const [subs, setSubs] = useState(() => localStorage.getItem("app_subs") === "true");

    useEffect(() => {
        localStorage.setItem("app_quality", quality);
        localStorage.setItem("app_autoplay", autoplay);
        localStorage.setItem("app_subs", subs);
        window.dispatchEvent(new Event("settingsChanged"));
    }, [quality, autoplay, subs]);

    const Switch = ({ active, onToggle }) => (
        <button onClick={onToggle} className={`w-12 h-6 rounded-full relative transition-all ${active ? 'bg-[#0066FF]' : 'bg-gray-400'}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${active ? 'left-7' : 'left-1'}`} />
        </button>
    );

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <div className={`flex items-center justify-between p-5 rounded-3xl border ${isDark ? 'bg-[#0066FF]/5 border-[#0066FF]/20' : 'bg-gray-100 border-gray-200'}`}>
                    <div>
                        <p className="font-bold text-sm">Video Resolution</p>
                        <p className="text-[10px] text-gray-500 uppercase">Current Choice: {quality}</p>
                    </div>
                    <span className="bg-[#0066FF] text-white text-[10px] font-black px-3 py-1 rounded-full">{quality}</span>
                </div>

                <div className="relative">
                    <select
                        value={quality}
                        onChange={(e) => setQuality(e.target.value)}
                        className={`w-full appearance-none p-4 rounded-2xl border font-bold text-sm outline-none focus:border-[#0066FF] transition-colors ${isDark ? 'bg-black border-gray-800 text-white' : 'bg-white border-gray-300 text-black'}`}
                    >
                        <option value="SD (480p)">SD (480p)</option>
                        <option value="HD (1080p)">HD (1080p)</option>
                        <option value="4K (Ultra)">4K (Ultra)</option>
                    </select>
                    <ChevronRight className="absolute right-4 top-4 text-gray-500 pointer-events-none rotate-90" size={20} />
                </div>
            </div>

            <div className="space-y-4">
                <div className={`flex items-center justify-between p-4 rounded-2xl border ${isDark ? 'bg-black/40 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <div>
                        <p className="text-sm font-bold">Autoplay Previews</p>
                        <p className="text-[10px] text-gray-500 uppercase font-medium">Remembered choice: {autoplay ? "ON" : "OFF"}</p>
                    </div>
                    <Switch active={autoplay} onToggle={() => setAutoplay(!autoplay)} />
                </div>

                <div className={`flex items-center justify-between p-4 rounded-2xl border ${isDark ? 'bg-black/40 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-bold">Subtitles</p>
                        <Captions size={14} className="text-[#0066FF]" />
                    </div>
                    <Switch active={subs} onToggle={() => setSubs(!subs)} />
                </div>
            </div>
        </div>
    );
}