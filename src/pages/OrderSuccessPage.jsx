/* ══════════════════════════════════════
   ORDER SUCCESS
══════════════════════════════════════ */
function OrderSuccessPage({ onNav }) {
    const orderId = 'ORD-' + Math.random().toString(36).slice(2, 7).toUpperCase();
    return (
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"><span className="text-5xl">✅</span></div>
            <h1 className="text-4xl font-black text-white mb-3">Order Placed!</h1>
            <p className="text-gray-400 mb-1">Thank you! Your order is being processed.</p>
            <p className="text-gray-500 text-sm mb-8">A confirmation email has been sent to your inbox.</p>
            <div className="bg-gray-800 rounded-2xl p-5 mb-7">
                <p className="text-gray-500 text-sm mb-1">Order ID</p>
                <p className="text-white font-mono text-2xl font-black text-yellow-400">{orderId}</p>
            </div>
            <div className="flex gap-4 justify-center">
                <button onClick={() => onNav('dashboard')} className="bg-yellow-500 hover:bg-yellow-400 text-black font-black px-6 py-3 rounded-2xl" style={{ transition: 'background .15s' }}>View Orders</button>
                <button onClick={() => onNav('shop')} className="border border-gray-700 hover:border-yellow-500 text-white px-6 py-3 rounded-2xl" style={{ transition: 'border-color .15s' }}>Continue Shopping</button>
            </div>
        </div>
    );
}
export default OrderSuccessPage