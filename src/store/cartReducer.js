
/* ══════════════════════════════════════
   CART REDUCER
══════════════════════════════════════ */
export function cartReducer(state, action) {
    switch (action.type) {
        case 'ADD': {
            const ex = state.find(i => i.id === action.p.id);
            if (ex) return state.map(i => i.id === action.p.id ? { ...i, qty: i.qty + 1 } : i);
            return [...state, { ...action.p, qty: 1 }];
        }
        case 'REMOVE': return state.filter(i => i.id !== action.id);
        case 'QTY': return state.map(i => i.id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i);
        case 'CLEAR': return [];
        default: return state;
    }
}