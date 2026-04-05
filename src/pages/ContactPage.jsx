    // pages/ContactPage.jsx
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

function ContactPage({ showToast }) {
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [f, setF] = useState({ name: "", email: "", subject: "", message: "" });

    useEffect(() => {
        if (!success) return;
        const t = setTimeout(() => setSuccess(false), 3000);
        return () => clearTimeout(t);
    }, [success]);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);

            // const res = await fetch("http://localhost:5000/api/contact", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json"
            //     },
            //     body: JSON.stringify(f)
            
            


        try {
            // ✅ Use supabase.functions.invoke() — handles auth token automatically
            const { data, error } = await supabase.functions.invoke("send-order-email", {
                body: { type: "contact", form: f },
            });

            if (error) {
                console.error("Function error:", error);
                showToast(error.message || "Something went wrong ❌", "error");
                return;
            }

            setSuccess(true);
            showToast("Message sent! We'll reply within 24 hours 📬");
            setF({ name: "", email: "", subject: "", message: "" });

        } catch (err) {
            console.error("Network error:", err);
            showToast("Server error — please try again ❌", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-black text-white mb-3">Contact Us</h1>
                <p className="text-gray-400">We'd love to hear from you. Send a message and we'll respond promptly.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Info cards */}
                <div className="space-y-4">
                    {[
                        ["📧", "Email",   "support@ableenterprise.com"],
                        ["📞", "Phone",   "+1 (555) 123-4567"],
                        ["📍", "Address", "123 Tech Street, Silicon Valley, CA 94102"],
                        ["⏰", "Hours",   "Mon–Fri: 9AM–6PM\nSat: 10AM–4PM EST"],
                    ].map(([icon, l, v]) => (
                        <div key={l} className="hover:bg-gray-700 bg-gray-800 rounded-2xl p-5 flex items-start gap-4 transition-colors">
                            <span className="text-2xl">{icon}</span>
                            <div>
                                <p className="text-white font-black text-sm">{l}</p>
                                <p className="text-gray-400 text-sm whitespace-pre-line">{v}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Form */}
                <form onSubmit={submit} className="bg-gray-800 rounded-2xl p-6 space-y-4">
                    <h2 className="text-white font-black text-xl mb-1">Send a Message</h2>

                    {[["name", "Your Name", "text"], ["email", "Email Address", "email"], ["subject", "Subject", "text"]].map(([k, ph, t]) => (
                        <input
                            key={k} type={t} value={f[k]} placeholder={ph} required
                            onChange={e => setF({ ...f, [k]: e.target.value })}
                            className="hover:bg-gray-600 w-full bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:border-blue-500 text-sm transition-colors"
                        />
                    ))}

                    <textarea
                        value={f.message} placeholder="Your message…" rows={4} required
                        onChange={e => setF({ ...f, message: e.target.value })}
                        className="hover:bg-gray-600 w-full bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:border-blue-500 text-sm resize-none transition-colors"
                    />

                    <button type="submit" disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-black py-3.5 rounded-2xl transition-all">
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Sending…
                            </span>
                        ) : "Send Message 📤"}
                    </button>
                </form>
            </div>

            {/* Success popup */}
            {success && (
                <div className="fixed top-5 right-5 z-50 bg-green-500 text-black px-6 py-3 rounded-xl font-bold shadow-xl animate-bounce">
                    ✅ Message sent successfully!
                </div>
            )}
        </div>
    );
}

export default ContactPage;