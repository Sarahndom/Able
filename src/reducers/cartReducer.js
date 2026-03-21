export function cartReducer(state, action) {
    switch (action.type) {
        case "ADD":
            return [...state, action.p];
        case "REMOVE":
            return state.filter(item => item.id !== action.id);
        default:
            return state;
    }
}