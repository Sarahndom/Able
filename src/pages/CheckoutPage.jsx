/* ══════════════════════════════════════
   CHECKOUT (multi-step)
══════════════════════════════════════ */
import { useState } from "react";

function CheckoutPage({ cart, dispatch, user, onNav, showToast }) {
    const [step, setStep] = useState(1);
    const [addr, setAddr] = useState({ name: user?.name || '', email: user?.email || '', phone: '', address: '', city: '', state: '', zip: '', country: 'US' });
    const [pay, setPay] = useState('card');
    const [card, setCard] = useState({ num: '', exp: '', cvv: '', name: '' });
    const [busy, setBusy] = useState(false);
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const total = subtotal + (subtotal > 50 ? 0 : 9.99);

    if (cart.length === 0) return <div className="text-center py-20"><p className="text-gray-400 mb-4">Your cart is empty.</p><button onClick={() => onNav('shop')} className="bg-yellow-500 text-black font-bold px-6 py-3 rounded-2xl">Go Shopping</button></div>;

    const place = async () => {
        setBusy(true);
        await new Promise(r => setTimeout(r, 2000));
        setBusy(false);
        dispatch({ type: 'CLEAR' });
        showToast('Order placed successfully! 🎉');
        onNav('order-success');
    };

    const Field = ({ k, l, type = 'text', span = false }) => (
        <div className={span ? 'col-span-2' : ''}>
            <label className="text-gray-400 text-xs block mb-1">{l}</label>
            <input type={type} value={addr[k]} onChange={e => setAddr({ ...addr, [k]: e.target.value })} placeholder={l}
                className="w-full bg-gray-700 text-white px-3 py-2.5 rounded-xl border border-gray-600 focus:outline-none focus:border-yellow-500 text-sm" />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-black text-white mb-7">Checkout</h1>
            {/* Steps */}
            <div className="flex items-center mb-8">
                {['Shipping', 'Payment', 'Review'].map((s, i) => (
                    <div key={s} className="flex items-center flex-1">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-500'}`}>{step > i + 1 ? '✓' : i + 1}</div>
                        <span className={`ml-2 text-sm font-semibold ${step === i + 1 ? 'text-white' : 'text-gray-600'}`}>{s}</span>
                        {i < 2 && <div className={`flex-1 h-0.5 mx-3 ${step > i + 1 ? 'bg-green-500' : 'bg-gray-700'}`} />}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    {step === 1 && (
                        <div className="bg-gray-800 rounded-2xl p-6">
                            <h2 className="text-white font-black text-xl mb-5">📦 Shipping Address</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <Field k="name" l="Full Name" />
                                <Field k="email" l="Email" type="email" />
                                <Field k="phone" l="Phone" type="tel" />
                                <Field k="country" l="Country" />
                                <Field k="address" l="Street Address" span />
                                <Field k="city" l="City" />
                                <Field k="state" l="State / Province" />
                                <Field k="zip" l="ZIP / Postal Code" />
                            </div>
                            <button onClick={() => setStep(2)} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-3.5 rounded-2xl mt-5 text-lg" style={{ transition: 'background .15s' }}>Continue to Payment →</button>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="bg-gray-800 rounded-2xl p-6">
                            <h2 className="text-white font-black text-xl mb-5">💳 Payment</h2>
                            <div className="grid grid-cols-2 gap-3 mb-5">
                                {[['card', '💳 Credit / Debit Card'], ['paypal', '🅿️ PayPal']].map(([m, l]) => (
                                    <button key={m} onClick={() => setPay(m)}
                                        className={`p-4 rounded-2xl border-2 text-sm font-semibold ${pay === m ? 'border-yellow-500 bg-yellow-500/10 text-white' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`} style={{ transition: 'all .15s' }}>
                                        {l}
                                    </button>
                                ))}
                            </div>
                            {pay === 'card' && (
                                <div className="space-y-4">
                                    <div><label className="text-gray-400 text-xs block mb-1">Card Number</label><input value={card.num} onChange={e => setCard({ ...card, num: e.target.value })} placeholder="1234 5678 9012 3456" className="w-full bg-gray-700 text-white px-4 py-2.5 rounded-xl border border-gray-600 focus:outline-none focus:border-yellow-500 text-sm font-mono" /></div>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[['exp', 'Expiry', 'MM/YY'], ['cvv', 'CVV', '123'], ['name', 'Name on Card', 'J. Smith']].map(([k, l, ph]) => (
                                            <div key={k}><label className="text-gray-400 text-xs block mb-1">{l}</label><input value={card[k]} onChange={e => setCard({ ...card, [k]: e.target.value })} placeholder={ph} className="w-full bg-gray-700 text-white px-3 py-2.5 rounded-xl border border-gray-600 focus:outline-none focus:border-yellow-500 text-sm" /></div>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2 bg-gray-700/50 rounded-xl p-3 text-xs text-gray-500">🔒 Demo mode — no real payment processed. Powered by <span className="text-yellow-400 font-bold">Stripe</span>.</div>
                                </div>
                            )}
                            {pay === 'paypal' && <div className="bg-blue-900/20 border border-blue-700 rounded-2xl p-6 text-center text-gray-400 text-sm">You will be redirected to PayPal to complete payment.</div>}
                            <div className="flex gap-3 mt-5">
                                <button onClick={() => setStep(1)} className="flex-1 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white py-3 rounded-2xl text-sm" style={{ transition: 'all .15s' }}>← Back</button>
                                <button onClick={() => setStep(3)} className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-black py-3 rounded-2xl" style={{ transition: 'background .15s' }}>Review Order →</button>
                            </div>
                        </div>
                    )}
                    {step === 3 && (
                        <div className="bg-gray-800 rounded-2xl p-6">
                            <h2 className="text-white font-black text-xl mb-5">✅ Review Order</h2>
                            <div className="space-y-3 mb-5">
                                {cart.map(i => (
                                    <div key={i.id} className="flex items-center gap-3 py-3 border-b border-gray-700 last:border-0">
                                        <img src={i.img} alt={i.name} className="w-14 h-14 object-cover rounded-xl" onError={e => e.target.src = 'https://placehold.co/56x56/1f2937/6b7280'} />
                                        <div className="flex-1 min-w-0"><p className="text-white text-sm font-semibold truncate">{i.name}</p><p className="text-gray-500 text-xs">Qty: {i.qty}</p></div>
                                        <span className="text-yellow-400 font-black">${(i.price * i.qty).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
                                <div className="bg-gray-700/50 rounded-xl p-3"><p className="text-gray-500 text-xs mb-1">Ship to</p><p className="text-white text-xs">{addr.address || '—'}, {addr.city || '—'}</p></div>
                                <div className="bg-gray-700/50 rounded-xl p-3"><p className="text-gray-500 text-xs mb-1">Payment</p><p className="text-white text-xs">{pay === 'card' ? '💳 Credit Card' : '🅿️ PayPal'}</p></div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setStep(2)} className="flex-1 border border-gray-700 text-gray-400 hover:text-white py-3 rounded-2xl text-sm" style={{ transition: 'all .15s' }}>← Back</button>
                                <button onClick={place} disabled={busy} className="flex-1 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-70 text-black font-black py-3 rounded-2xl flex items-center justify-center gap-2" style={{ transition: 'background .15s' }}>
                                    {busy ? <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span> Processing…</> : `Place Order · $${total.toFixed(2)}`}
                                    <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                {/* Summary */}
                <div className="bg-gray-800 rounded-2xl p-5 h-fit">
                    <h3 className="text-white font-bold mb-4">Summary</h3>
                    {cart.map(i => (
                        <div key={i.id} className="flex justify-between text-xs py-2 border-b border-gray-700 last:border-0">
                            <span className="text-gray-400 truncate mr-2 max-w-32">{i.name}</span>
                            <span className="text-white flex-shrink-0">×{i.qty} ${(i.price * i.qty).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="mt-3 pt-3 border-t border-gray-700 flex justify-between font-black"><span className="text-white">Total</span><span className="text-yellow-400">${total.toFixed(2)}</span></div>
                </div>
            </div>
        </div>
    );
}
export default CheckoutPage