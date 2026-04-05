// pages/checkout/PaymentForm.jsx
import { useEffect, useRef, useState } from "react";
import { CreditCard, Building2, Wallet, Lock, AlertCircle } from "lucide-react";

const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "";

let stripePromise = null;
const loadStripe = () => {
    if (!stripePromise && STRIPE_KEY) {
        stripePromise = new Promise((resolve, reject) => {
            if (window.Stripe) { resolve(window.Stripe(STRIPE_KEY)); return; }
            const s = document.createElement("script");
            s.src = "https://js.stripe.com/v3/";
            s.onload  = () => resolve(window.Stripe(STRIPE_KEY));
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }
    return stripePromise;
};

const METHODS = [
    { id: "card",     icon: <CreditCard size={18} />, label: "Credit / Debit Card", sub: "Visa, Mastercard, Amex, Apple Pay" },
    { id: "transfer", icon: <Building2 size={18} />,  label: "Bank Transfer",       sub: "Pay directly from your bank account" },
    { id: "paypal",   icon: <Wallet size={18} />,     label: "PayPal",              sub: "Pay with your PayPal balance or card" },
];

export default function PaymentForm({
    onStripeReady,
    payError,
    onBack,
    onNext,
    method,
    setMethod,
}) {
    const cardRef  = useRef(null);
    const [ready, setReady]     = useState(false);
    const [loadErr, setLoadErr] = useState("");

    // Load Stripe only when card method is active
    useEffect(() => {
        if (method !== "card" || !STRIPE_KEY || ready) return;
        loadStripe()
            .then(stripe => {
                const elements = stripe.elements();
                const card = elements.create("card", {
                    style: {
                        base: { color: "#fff", fontFamily: "system-ui,sans-serif", fontSize: "15px", "::placeholder": { color: "#4b5563" } },
                        invalid: { color: "#f87171" },
                    },
                });
                card.mount(cardRef.current);
                setReady(true);
                onStripeReady(stripe, elements);
            })
            .catch(() => setLoadErr("Failed to load card processor. Please refresh or choose another method."));
    }, [method]);

    const error = loadErr || payError;

    return (
        <div className="bg-gray-800 border border-gray-700/50 rounded-2xl p-5 sm:p-6">
            <h2 className="text-white font-black text-lg mb-5 flex items-center gap-2">
                <CreditCard size={18} className="text-blue-400" />
                Choose Payment Method
            </h2>

            {/* Method selector */}
            <div className="space-y-3 mb-5">
                {METHODS.map(m => (
                    <button
                        key={m.id}
                        type="button"
                        onClick={() => setMethod(m.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                            method === m.id
                                ? "border-blue-500 bg-blue-600/10"
                                : "border-gray-700 hover:border-gray-500 bg-gray-700/30"
                        }`}
                    >
                        <div className={`p-2.5 rounded-xl flex-shrink-0 transition-all ${method === m.id ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-400"}`}>
                            {m.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`font-bold text-sm ${method === m.id ? "text-white" : "text-gray-300"}`}>{m.label}</p>
                            <p className="text-gray-500 text-xs">{m.sub}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${method === m.id ? "border-blue-500 bg-blue-600" : "border-gray-600"}`}>
                            {method === m.id && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                    </button>
                ))}
            </div>

            {/* ── Card fields ── */}
            {method === "card" && (
                STRIPE_KEY ? (
                    <div className="mb-4">
                        <label className="text-gray-400 text-xs block mb-2 font-semibold uppercase tracking-wide">Card Details</label>
                        <div
                            ref={cardRef}
                            className="bg-gray-900 border border-gray-600 rounded-xl p-4 focus-within:border-blue-500 transition-colors min-h-[52px]"
                        />
                        <p className="text-gray-600 text-xs mt-2 flex items-center gap-1.5">
                            <Lock size={11} /> Encrypted by Stripe — your card details never touch our servers.
                        </p>
                    </div>
                ) : (
                    <div className="bg-blue-600/10 border border-blue-600/20 rounded-2xl p-4 mb-4">
                        <p className="text-blue-300 text-sm font-black mb-1">🔒 Demo Payment Mode</p>
                        <p className="text-blue-400/70 text-xs leading-relaxed">
                            Add <code className="bg-black/20 px-1 rounded">VITE_STRIPE_PUBLISHABLE_KEY</code> to your{" "}
                            <code className="bg-black/20 px-1 rounded">.env</code> to enable live card payments via Stripe.
                        </p>
                    </div>
                )
            )}

            {/* ── Bank transfer details ── */}
            {method === "transfer" && (
                <div className="bg-gray-700/40 border border-gray-600/50 rounded-2xl p-4 mb-4 space-y-2.5">
                    <p className="text-white font-bold text-sm mb-1">Bank Transfer Details</p>
                    {[
                        ["Bank Name",        "Able Enterprise Bank"],
                        ["Account Number",   "0123 4567 89"],
                        ["Sort Code",        "12-34-56"],
                        ["Account Name",     "Able Enterprise Ltd"],
                        ["Reference",        "Use your email address as reference"],
                    ].map(([k, v]) => (
                        <div key={k} className="flex justify-between text-xs gap-4">
                            <span className="text-gray-500 flex-shrink-0">{k}</span>
                            <span className="text-white font-semibold text-right">{v}</span>
                        </div>
                    ))}
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 mt-2">
                        <p className="text-yellow-400 text-xs leading-relaxed">
                            ⚠️ Transfer payments are verified manually within 1–2 business days. Your order will be processed once payment is confirmed.
                        </p>
                    </div>
                </div>
            )}

            {/* ── PayPal ── */}
            {method === "paypal" && (
                <div className="bg-blue-900/20 border border-blue-700/30 rounded-2xl p-4 mb-4">
                    <p className="text-white font-bold text-sm mb-1">PayPal Checkout</p>
                    <p className="text-gray-400 text-xs leading-relaxed">
                        You'll be securely redirected to PayPal to complete your payment. Return here after paying to confirm your order.
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                        <div className="bg-[#003087] text-white text-xs font-black px-3 py-1 rounded-full">Pay</div>
                        <div className="bg-[#009cde] text-white text-xs font-black px-2 py-1 rounded-full">Pal</div>
                        <span className="text-gray-500 text-xs">Buyer protection included</span>
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
                    <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-400 text-xs leading-relaxed">{error}</p>
                </div>
            )}

            <div className="flex gap-3">
                <button
                    onClick={onBack}
                    className="flex-1 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white py-3 rounded-2xl text-sm transition-all"
                >
                    ← Back
                </button>
                <button
                    onClick={onNext}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-2xl text-sm transition-all"
                >
                    Review Order →
                </button>
            </div>
        </div>
    );
}