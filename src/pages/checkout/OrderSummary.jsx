// import React from "react";

// export default function OrderSummary({ cart, subtotal, shipping, total }) {
//     return (

//         < div className="bg-gray-800 rounded-2xl p-5 h-fit lg:sticky lg:top-20" >
//             <h3 className="text-white font-black mb-4">Order Summary</h3>
//             <div className="space-y-2 mb-4">
//                 {cart.map(i => (
//                     <div key={i.id} className="flex justify-between text-xs py-1.5 border-b border-gray-700 last:border-0">
//                         <span className="text-gray-400 truncate mr-2 max-w-[130px]">{i.name} ×{i.qty}</span>
//                         <span className="text-white flex-shrink-0">${(i.price * i.qty).toFixed(2)}</span>
//                     </div>
//                 ))}
//             </div>
//             <div className="space-y-2 pt-2 border-t border-gray-700">
//                 <div className="flex justify-between text-sm text-gray-400">
//                     <span>Subtotal</span>
//                     <span className="text-white">${subtotal.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-sm text-gray-400">
//                     <span>Shipping</span>
//                     <span className={shipping === 0 ? "text-green-400 font-semibold" : "text-white"}>
//                         {shipping === 0 ? "FREE ✓" : `$${shipping.toFixed(2)}`}
//                     </span>
//                 </div>
//                 {subtotal < 50 && (
//                     <p className="text-blue-400 text-xs">Add ${(50 - subtotal).toFixed(2)} more for free shipping!</p>
//                 )}
//                 <div className="flex justify-between font-black text-lg pt-2 border-t border-gray-700 mt-2">
//                     <span className="text-white">Total</span>
//                     <span className="text-blue-400">${total.toFixed(2)}</span>
//                 </div>
//             </div>

//             <div className="mt-5 pt-4 border-t border-gray-700 space-y-2">
//                 {["🚚 Free shipping on orders over $50", "↩️ 30-day hassle-free returns", "🔒 Secure SSL payment processing"].map(f => (
//                     <p key={f} className="text-gray-600 text-xs">{f}</p>
//                 ))}
//             </div>
//         </div >

//     )
// }


import { ShoppingBag } from "lucide-react";

export default function OrderSummary({ cart, subtotal, shipping, total }) {
    const totalItems = cart.reduce((s, i) => s + i.qty, 0);

    return (
        <div className="bg-gray-800 border border-gray-700/50 rounded-2xl p-5 h-fit lg:sticky lg:top-20">
            <h3 className="text-white font-black mb-4 flex items-center gap-2">
                <ShoppingBag size={16} className="text-blue-400" />
                Order Summary
            </h3>

            {/* Item breakdown */}
            <div className="space-y-1.5 mb-4 max-h-44 overflow-y-auto pr-1">
                {cart.map(i => (
                    <div key={i.id} className="flex justify-between text-xs py-1 border-b border-gray-700/50 last:border-0">
                        <span className="text-gray-400 truncate mr-2 max-w-[130px]">
                            {i.name} <span className="text-gray-600">×{i.qty}</span>
                        </span>
                        <span className="text-white flex-shrink-0 font-semibold">
                            ${(i.price * i.qty).toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>

            {/* Totals */}
            <div className="border-t border-gray-700 pt-3 space-y-2.5">
                <div className="flex justify-between text-sm text-gray-400">
                    <span>Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""})</span>
                    <span className="text-white font-semibold">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-400">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-400 font-bold" : "text-white"}>
                        {shipping === 0 ? "FREE ✓" : `$${shipping.toFixed(2)}`}
                    </span>
                </div>

                {/* Free shipping progress bar */}
                {subtotal < 50 && (
                    <div className="bg-gray-700/50 rounded-xl p-3">
                        <p className="text-blue-400 text-xs mb-1.5">
                            Add <strong>${(50 - subtotal).toFixed(2)}</strong> more for free shipping!
                        </p>
                        <div className="w-full bg-gray-600 rounded-full h-1.5">
                            <div
                                className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }}
                            />
                        </div>
                    </div>
                )}

                <div className="flex justify-between font-black text-xl pt-2 border-t border-gray-700">
                    <span className="text-white">Total</span>
                    <span className="text-blue-400">${total.toFixed(2)}</span>
                </div>
            </div>

            {/* Trust badges */}
            <div className="mt-5 pt-4 border-t border-gray-700 space-y-1.5">
                {[
                    "🚚 Free shipping on orders over $50",
                    "↩️ 30-day hassle-free returns",
                    "🔒 Secure SSL payment processing",
                ].map(f => (
                    <p key={f} className="text-gray-600 text-xs">{f}</p>
                ))}
            </div>
        </div>
    );
}