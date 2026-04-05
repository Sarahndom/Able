import { createContext, useContext, useReducer, useEffect } from "react";

function cartReducer(state, action) {
    switch (action.type) {
        case "ADD": {
            const exists = state.find(i => i.id === action.product.id);
            if (exists) {
                return state.map(i =>
                    i.id === action.product.id
                        ? { ...i, qty: Math.min(i.qty + 1, i.stock ?? 99) }
                        : i
                );
            }
            return [...state, { ...action.product, qty: 1 }];
        }
        case "REMOVE":
            return state.filter(i => i.id !== action.id);
        case "INCREMENT":
            return state.map(i =>
                i.id === action.id ? { ...i, qty: Math.min(i.qty + 1, i.stock ?? 99) } : i
            );
        case "DECREMENT":
            return state
                .map(i => i.id === action.id ? { ...i, qty: i.qty - 1 } : i)
                .filter(i => i.qty > 0);
        case "SET_QTY":
            return state.map(i =>
                i.id === action.id ? { ...i, qty: Math.max(1, Math.min(action.qty, i.stock ?? 99)) } : i
            );
        case "CLEAR":
            return [];
        default:
            return state;
    }
}

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [cart, dispatch] = useReducer(cartReducer, [], () => {
        try {
            const saved = localStorage.getItem("ae_cart");
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });

    useEffect(() => {
        try { localStorage.setItem("ae_cart", JSON.stringify(cart)); }
        catch { /* storage unavailable */ }
    }, [cart]);

    const totalItems = cart.reduce((s, i) => s + i.qty, 0);
    const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

    // Guests CAN add to cart — badge shows. Viewing cart requires login (handled in App).
    const addToCart  = (product) => dispatch({ type: "ADD",       product });
    const removeItem = (id)      => dispatch({ type: "REMOVE",    id });
    const increment  = (id)      => dispatch({ type: "INCREMENT", id });
    const decrement  = (id)      => dispatch({ type: "DECREMENT", id });
    const setQty     = (id, qty) => dispatch({ type: "SET_QTY",   id, qty });
    const clearCart  = ()        => dispatch({ type: "CLEAR" });

    return (
        <CartContext.Provider value={{
            cart, dispatch, totalItems, totalPrice,
            addToCart, removeItem, increment, decrement, setQty, clearCart,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be inside <CartProvider>");
    return ctx;
}

export default CartContext;