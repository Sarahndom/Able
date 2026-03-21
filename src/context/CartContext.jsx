import { useState } from "react";

import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

function reducer(state, action) {
    switch (action.type) {
        case "ADD": {
            const existing = state.find(i => i.id === action.product.id);

            if (existing) {
                return state.map(i =>
                    i.id === action.product.id
                        ? { ...i, qty: i.qty + 1 }
                        : i
                );
            }

            return [...state, { ...action.product, qty: 1 }];
        }

        case "QTY": {
            return state
                .map(i => {
                    if (i.id === action.id) {
                        const newQty = action.qty;

                        // ✅ remove item if qty <= 0
                        if (newQty <= 0) return null;

                        return { ...i, qty: newQty };
                    }
                    return i;
                })
                .filter(Boolean); // removes null
        }

        case "REMOVE":
            return state.filter(i => i.id !== action.id);

        case "CLEAR":
            return [];

        default:
            return state;
    }
}



export function CartProvider({ children }) {
    const [cart, dispatch] = useReducer(
        reducer,
        JSON.parse(localStorage.getItem("cart")) || []
    );

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    return (
        <CartContext.Provider value={{ cart, dispatch }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);