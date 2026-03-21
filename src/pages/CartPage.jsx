/* ══════════════════════════════════════
   CART
══════════════════════════════════════ */
import { useCart } from "../context/CartContext"; // ✅ IMPORTANT

function CartPage({ onNav }) {
    const { cart, dispatch } = useCart(); // ✅ USE CONTEXT

    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const shipping = subtotal > 50 ? 0 : 9.99;
    const total = subtotal + shipping;

    if (cart.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-24 text-center">
                <div className="text-7xl mb-5">🛒</div>
                <h2 className="text-3xl font-black text-white mb-3">Your cart is empty</h2>
                <p className="text-gray-400 mb-7">Looks like you haven't added anything yet.</p>
                <button
                    onClick={() => onNav('shop')}
                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-black px-8 py-4 rounded-2xl text-lg"
                >
                    Start Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-black text-white mb-6">
                Shopping Cart{" "}
                <span className="text-gray-500 font-normal text-xl">
                    ({cart.reduce((s, i) => s + i.qty, 0)} items)
                </span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* CART ITEMS */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item) => (
                        <div
                            key={item.id} // ✅ FIXED KEY
                            className="bg-gray-800 rounded-2xl p-4 flex items-center gap-4"
                        >
                            <img
                                src={item.img}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-xl"
                                onError={e =>
                                (e.target.src =
                                    "https://placehold.co/80x80/1f2937/6b7280")
                                }
                            />

                            <div className="flex-1">
                                <h3 className="text-white font-semibold text-sm truncate">
                                    {item.name}
                                </h3>
                                <p className="text-gray-500 text-xs">
                                    {item.brand}
                                </p>
                                <p className="text-yellow-400 font-bold">
                                    ${item.price}
                                </p>
                            </div>

                            {/* ✅ WORKING QUANTITY CONTROL */}
                            <div className="flex items-center bg-gray-700 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => {
                                        if (item.qty === 1) {
                                            dispatch({ type: "REMOVE", id: item.id });
                                        } else {
                                            dispatch({
                                                type: "QTY",
                                                id: item.id,
                                                qty: item.qty - 1,
                                            });
                                        }
                                    }}
                                    className="w-9 h-9 text-gray-400 hover:text-white flex items-center justify-center"
                                >
                                    −
                                </button>

                                <span className="w-8 text-center text-white font-bold text-sm">
                                    {item.qty}
                                </span>

                                <button
                                    onClick={() =>
                                        dispatch({
                                            type: "QTY",
                                            id: item.id,
                                            qty: item.qty + 1,
                                        })
                                    }
                                    className="w-9 h-9 text-gray-400 hover:text-white flex items-center justify-center"
                                >
                                    +
                                </button>
                            </div>

                            <div className="text-right">
                                <p className="text-white font-black">
                                    ${(item.price * item.qty).toFixed(2)}
                                </p>
                                <button
                                    onClick={() =>
                                        dispatch({ type: "REMOVE", id: item.id })
                                    }
                                    className="text-red-500 hover:text-red-400 text-xs"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={() => dispatch({ type: "CLEAR" })}
                        className="text-gray-600 hover:text-red-400 text-sm mt-2"
                    >
                        🗑 Clear cart
                    </button>
                </div>

                {/* SUMMARY */}
                <div className="bg-gray-800 rounded-2xl p-6 h-fit sticky top-20">
                    <h3 className="text-white font-black text-xl mb-5">
                        Order Summary
                    </h3>

                    <div className="space-y-3 text-sm mb-5">
                        <div className="flex justify-between text-gray-400">
                            <span>Subtotal</span>
                            <span className="text-white">
                                ${subtotal.toFixed(2)}
                            </span>
                        </div>

                        <div className="flex justify-between text-gray-400">
                            <span>Shipping</span>
                            <span className={shipping === 0 ? "text-green-400" : "text-white"}>
                                {shipping === 0 ? "FREE ✓" : `$${shipping.toFixed(2)}`}
                            </span>
                        </div>

                        <div className="border-t border-gray-700 pt-3 flex justify-between font-black text-lg">
                            <span className="text-white">Total</span>
                            <span className="text-yellow-400">
                                ${total.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => onNav("checkout")}
                        className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 rounded-2xl text-lg"
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CartPage;
