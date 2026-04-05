// pages/checkout/ReviewOrder.jsx
import { ClipboardCheck, Lock, AlertCircle } from "lucide-react";

const METHOD_LABELS = {
    card:     "💳 Credit / Debit Card",
    transfer: "🏦 Bank Transfer",
    paypal:   "🅿️ PayPal",
};

export default function ReviewOrder({ cart, addr, total, busy, payError, onBack, onPlace, paymentMethod = "card" }) {
    return (
        <div className="bg-gray-800 border border-gray-700/50 rounded-2xl p-5 sm:p-6">
            <h2 className="text-white font-black text-lg mb-5 flex items-center gap-2">
                <ClipboardCheck size={18} className="text-blue-400" />
                Review &amp; Confirm
            </h2>

            {/* Items */}
            <div className="space-y-3 mb-5">
                {cart.map(i => (
                    <div key={i.id} className="flex items-center gap-3 py-3 border-b border-gray-700/50 last:border-0">
                        <img src={i.img} alt={i.name}
                            className="w-14 h-14 object-cover rounded-xl flex-shrink-0 bg-gray-700"
                            onError={e => { e.target.src = "https://placehold.co/56x56/1f2937/6b7280"; }} />
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-semibold truncate">{i.name}</p>
                            <p className="text-gray-500 text-xs">Qty: {i.qty} × ${i.price}</p>
                        </div>
                        <span className="text-blue-400 font-black flex-shrink-0 text-sm">
                            ${(i.price * i.qty).toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>

            {/* Ship + Payment summary */}
            <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-gray-700/40 rounded-xl p-3 border border-gray-700/50">
                    <p className="text-gray-500 text-[10px] mb-1.5 font-bold uppercase tracking-wide">Ship to</p>
                    <p className="text-white text-xs font-semibold">{addr.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5 truncate">{addr.address}{addr.city ? `, ${addr.city}` : ""}</p>
                    {addr.phone && <p className="text-gray-500 text-xs mt-0.5">{addr.phone}</p>}
                </div>
                <div className="bg-gray-700/40 rounded-xl p-3 border border-gray-700/50">
                    <p className="text-gray-500 text-[10px] mb-1.5 font-bold uppercase tracking-wide">Payment</p>
                    <p className="text-white text-xs font-semibold">{METHOD_LABELS[paymentMethod] || "Card"}</p>
                    <p className="text-gray-400 text-xs mt-0.5 truncate">{addr.email}</p>
                </div>
            </div>

            {paymentMethod === "transfer" && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 mb-4">
                    <p className="text-yellow-400 text-xs leading-relaxed">
                        ⚠️ Complete your bank transfer using your email as the reference. Your order is processed once payment clears (1–2 business days).
                    </p>
                </div>
            )}

            {payError && (
                <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
                    <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-400 text-xs leading-relaxed">{payError}</p>
                </div>
            )}

            <div className="flex gap-3">
                <button onClick={onBack} className="flex-1 border border-gray-700 text-gray-400 hover:text-white py-3 rounded-2xl text-sm transition-all">← Back</button>
                <button onClick={onPlace} disabled={busy}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.98]">
                    {busy ? (
                        <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing…</>
                    ) : (
                        <><Lock size={14} /> Pay ${total.toFixed(2)}</>
                    )}
                </button>
            </div>

            <p className="text-center text-gray-700 text-[11px] mt-4 flex items-center justify-center gap-1">
                <Lock size={10} /> Secured by Stripe. Payment info is never stored on our servers.
            </p>
        </div>
    );
}