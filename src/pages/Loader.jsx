import { useEffect } from "react";

function Loader({ onFinish }) {
    useEffect(() => {
        const timer = setTimeout(() => onFinish(), 2000); // 2 second load
        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
            <div className="relative">

                {/* Modern AE Monogram Logo Style */}
                <div className="w-34 h-34 border-4 border-[#0040FF]/20 border-t-[#0040FF] rounded-full animate-spin absolute -inset-4"></div>
                <div className="w-24 h-24 bg-[#0040FF] rounded-2xl flex items-center justify-center font-black text-white text-4xl shadow-lg shadow-[#0040FF]/20">
                    AE
                </div>
            </div>
            <h2 className="mt-8 text-white mt-15 font-bold tracking-widest animate-pulse">ABLE ENTERPRISES</h2>
        </div>
    );
}

export default Loader;