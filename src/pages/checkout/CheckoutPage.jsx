// pages/checkout/CheckoutPage.jsx
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useCart } from "../../context/CartContext";
import CheckoutSteps from "./CheckoutSteps";
import OrderSummary  from "./OrderSummary";
import ShippingForm  from "./ShippingForm";
import PaymentForm   from "./PaymentForm";
import ReviewOrder   from "./ReviewOrder";

const STRIPE_KEY       = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "";
const PAYMENT_ENDPOINT = import.meta.env.VITE_PAYMENT_ENDPOINT || "";

export default function CheckoutPage({ user, onNav, showToast }) {
    const { cart, totalPrice, clearCart } = useCart();

    const [step, setStep]                   = useState(1);
    const [busy, setBusy]                   = useState(false);
    const [payError, setPayError]           = useState("");
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [stripeRef, setStripeRef]         = useState({ stripe: null, elements: null });

    const [addr, setAddr] = useState({
        name:    user?.name    || "",
        email:   user?.email   || "",
        phone:   user?.phone   || "",
        address: user?.address || "",
        city: "", state: "", zip: "", country: "US",
    });

    const shipping = totalPrice > 50 ? 0 : 9.99;
    const total    = totalPrice + shipping;

    if (cart.length === 0) return (
        <div className="text-center py-24 px-4">
            <div className="text-6xl mb-5">🛒</div>
            <h2 className="text-2xl font-black text-white mb-3">Your cart is empty</h2>
            <button onClick={() => onNav("shop")}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3.5 rounded-2xl transition-all">
                Browse Products →
            </button>
        </div>
    );

    const placeOrder = async () => {
        setPayError(""); setBusy(true);
        try {
            // Non-card methods or demo mode → skip Stripe
            if (!STRIPE_KEY || !PAYMENT_ENDPOINT || paymentMethod !== "card") {
                await new Promise(r => setTimeout(r, 1600));
                await saveOrder("demo_" + Date.now(), paymentMethod);
                clearCart();
                showToast("Order placed successfully! 🎉");
                onNav("order-success");
                return;
            }

            // Real Stripe card payment
            const resp = await fetch(PAYMENT_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: Math.round(total * 100),
                    currency: "usd",
                    metadata: { customer_email: addr.email, customer_name: addr.name },
                }),
            });
            if (!resp.ok) throw new Error("Payment server error. Please try again.");
            const { clientSecret } = await resp.json();

            const cardElement = stripeRef.elements.getElement("card");
            const { paymentIntent, error: stripeErr } = await stripeRef.stripe.confirmCardPayment(
                clientSecret,
                { payment_method: { card: cardElement, billing_details: { name: addr.name, email: addr.email } } }
            );
            if (stripeErr)                              { setPayError(stripeErr.message); return; }
            if (paymentIntent?.status !== "succeeded") { setPayError("Payment incomplete. Try again."); return; }

            await saveOrder(paymentIntent.id, paymentIntent.status);
            clearCart();
            showToast("Payment successful! 🎉");
            onNav("order-success");

        } catch (err) {
            setPayError(err.message || "Payment failed. Please try again.");
        } finally { setBusy(false); }
    };

    const saveOrder = async (paymentId, paymentStatus) => {
        try {
            await supabase.from("orders").insert({
                user_id:          user?.id || null,
                customer_name:    addr.name,
                customer_email:   addr.email,
                customer_phone:   addr.phone,
                shipping_address: `${addr.address}, ${addr.city}, ${addr.state} ${addr.zip}, ${addr.country}`,
                items:            cart.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price, img: i.img })),
                subtotal:         parseFloat(totalPrice.toFixed(2)),
                shipping_cost:    shipping,
                total:            parseFloat(total.toFixed(2)),
                payment_id:       paymentId,
                payment_method:   paymentMethod,
                payment_status:   paymentStatus,
                status:           "Processing",
            });
        } catch (err) { console.error("Order save:", err); }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-7">Checkout</h1>
            <CheckoutSteps step={step} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    {step === 1 && (
                        <ShippingForm addr={addr} setAddr={setAddr} onNext={() => setStep(2)} />
                    )}
                    {step === 2 && (
                        <PaymentForm
                            payError={payError}
                            onStripeReady={(stripe, elements) => setStripeRef({ stripe, elements })}
                            onBack={() => setStep(1)}
                            onNext={() => setStep(3)}
                            method={paymentMethod}
                            setMethod={setPaymentMethod}
                        />
                    )}
                    {step === 3 && (
                        <ReviewOrder
                            cart={cart} addr={addr} total={total}
                            busy={busy} payError={payError}
                            paymentMethod={paymentMethod}
                            onBack={() => setStep(2)}
                            onPlace={placeOrder}
                        />
                    )}
                </div>
                <OrderSummary cart={cart} subtotal={totalPrice} shipping={shipping} total={total} />
            </div>
        </div>
    );
}