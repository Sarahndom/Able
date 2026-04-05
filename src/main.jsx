import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        {/* Single CartProvider — App.jsx reads from it via useCart() */}
        <CartProvider>
            <App />
        </CartProvider>
    </React.StrictMode>
);