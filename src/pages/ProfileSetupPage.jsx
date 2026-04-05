import { useState } from "react";
import { supabase } from "../lib/supabase";
import { User, Phone, MapPin, Mail, CheckCircle2, AlertCircle } from "lucide-react";

export default function ProfileSetupPage({ user, setUser, onNav, showToast }) {
    const [form, setForm] = useState({
        full_name: user?.name    || "",
        phone:     user?.phone   || "",
        address:   user?.address || "",
        email:     user?.email   || "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState("");

    const isComplete = form.full_name.trim() && form.phone.trim() && form.address.trim();

    const save = async (e) => {
        e.preventDefault();
        setError("");
        if (!isComplete) { setError("Please fill in all required fields."); return; }

        setLoading(true);
        try {
            const { error: dbErr } = await supabase
                .from("profiles")
                .update({
                    full_name: form.full_name.trim(),
                    phone:     form.phone.trim(),
                    address:   form.address.trim(),
                })
                .eq("id", user.id);

            if (dbErr) throw dbErr;

            const updated = { ...user, name: form.full_name.trim(), phone: form.phone.trim(), address: form.address.trim() };
            setUser(updated);
            localStorage.setItem("able_user", JSON.stringify(updated));
            showToast("Profile saved successfully!");
            onNav("dashboard");
        } catch (err) {
            setError("Failed to save profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { key: "full_name", label: "Full Name *",         icon: <User size={16} />,    type: "text",  ph: "John Smith",              required: true },
        { key: "email",     label: "Email Address",       icon: <Mail size={16} />,    type: "email", ph: user?.email || "",         required: false, disabled: true },
        { key: "phone",     label: "Phone Number *",      icon: <Phone size={16} />,   type: "tel",   ph: "+1 (555) 000-0000",        required: true },
        { key: "address",   label: "Delivery Address *",  icon: <MapPin size={16} />,  type: "text",  ph: "123 Main St, City, Country", required: true, span: true },
    ];

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-lg">

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 font-black text-white text-2xl shadow-2xl shadow-blue-600/30">AE</div>
                    <h1 className="text-2xl font-black text-white">Set Up Your Profile</h1>
                    <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">
                        We need a few details to deliver your orders and personalise your experience.
                    </p>
                </div>

                <form onSubmit={save} className="bg-gray-900 border border-gray-800 rounded-2xl p-7 space-y-5 shadow-2xl">

                    {error && (
                        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-3.5">
                            <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-red-400 text-xs">{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {fields.map(({ key, label, icon, type, ph, required, disabled, span }) => (
                            <div key={key} className={span ? "sm:col-span-2" : ""}>
                                <label className="text-gray-400 text-xs block mb-1.5 font-semibold uppercase tracking-wide flex items-center gap-1.5">
                                    {icon} {label}
                                </label>
                                <input
                                    type={type}
                                    value={form[key]}
                                    placeholder={ph}
                                    required={required}
                                    disabled={disabled}
                                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                                    className={`w-full bg-black text-white px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none focus:border-blue-500
                                        ${disabled ? "border-gray-800 opacity-50 cursor-not-allowed" : "border-gray-800 hover:border-gray-700"}`}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Completion indicator */}
                    <div className="flex items-center gap-3 bg-gray-800/60 rounded-xl p-3">
                        <CheckCircle2 size={16} className={isComplete ? "text-green-500" : "text-gray-600"} />
                        <span className={`text-xs font-semibold ${isComplete ? "text-green-400" : "text-gray-500"}`}>
                            {isComplete ? "Profile is complete — you're ready to order!" : "Fill in all required (*) fields to complete your profile."}
                        </span>
                    </div>

                    <button type="submit" disabled={loading || !isComplete}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black py-4 rounded-xl transition-all active:scale-[0.98]">
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving…
                            </span>
                        ) : "Save Profile"}
                    </button>

                    <button type="button" onClick={() => onNav("dashboard")} className="w-full text-gray-700 hover:text-gray-500 text-xs transition-colors py-1">
                        Skip for now →
                    </button>
                </form>
            </div>
        </div>
    );
}