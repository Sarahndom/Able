/* ══════════════════════════════════════
   PRODUCT CARD
══════════════════════════════════════ */
import Stars from "./ui/Stars";
import { useCart } from "../context/CartContext";

const ProductCard = ({ p, onAdd, onNav }) => {
    const { cart, dispatch } = useCart(); // ✅ ADDED cart

    // ✅ CHECK IF ITEM EXISTS IN CART
    const item = cart.find(i => i.id === p.id);

    return (
        <div
            className="bg-gray-800 rounded-xl overflow-hidden flex flex-col"
            style={{ transition: 'transform .2s,box-shadow .2s' }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(234,179,8,.1)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            <div
                className="relative overflow-hidden h-44 cursor-pointer"
                onClick={() => onNav('product-detail', p)}
            >
                <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    onError={e =>
                    (e.target.src =
                        'https://placehold.co/400x300/1f2937/6b7280?text=Product')
                    }
                />

                {p.disc > 0 && (
                    <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                        -{p.disc}%
                    </span>
                )}

                <span
                    className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-bold ${p.stock > 0
                        ? 'bg-green-900 text-green-300'
                        : 'bg-red-900 text-red-300'
                        }`}
                >
                    {p.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
            </div>

            <div className="p-4 flex flex-col flex-1">
                <p className="text-gray-500 text-xs mb-0.5">{p.brand}</p>

                <h3
                    className="text-white text-sm font-semibold mb-2 cursor-pointer hover:text-blue-400"
                    onClick={() => onNav('product-detail', p)}
                >
                    {p.name}
                </h3>

                <div className="flex items-center gap-1 mb-3">
                    <Stars r={p.rating} />
                    <span className="text-gray-500 text-xs">
                        ({p.reviews})
                    </span>
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <div>
                        <span className="text-blue-400 font-bold text-lg">
                            ${p.price}
                        </span>
                    </div>

                    {/* ✅ UPDATED CART LOGIC */}
                    {!item ? (
                        <button
                            onClick={() =>
                                dispatch({ type: "ADD", product: p })
                            }
                            disabled={p.stock === 0}
                            className="bg-blue-500 hover:bg-blue-400 disabled:opacity-40 text-black text-xs font-bold px-3 py-2 rounded-lg"
                        >
                            + Cart
                        </button>
                    ) : (
                        <div className="flex items-center bg-gray-700 rounded-xl overflow-hidden flex-shrink-0">
                            <button
                                onClick={() =>
                                    dispatch({
                                        type: "QTY",
                                        id: item.id,
                                        qty: item.qty - 1,
                                    })
                                }
                                className="w-9 h-9 text-gray-400 hover:text-white text-xl flex items-center justify-center"
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
                                className="w-9 h-9 text-gray-400 hover:text-white text-xl flex items-center justify-center"
                            >
                                +
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;