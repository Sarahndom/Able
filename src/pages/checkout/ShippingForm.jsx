import { Truck } from "lucide-react";

export default function ShippingForm({ addr, setAddr, onNext }) {
    const canContinue = addr.name && addr.email && addr.address;

    const Field = ({ label, k, type = "text", span = false }) => (
        <div className={span ? "col-span-2" : ""}>
            <label className="text-gray-400 text-xs block mb-1 font-medium">{label}</label>
            <input
                type={type}
                value={addr[k]}
                onChange={e => setAddr(prev => ({ ...prev, [k]: e.target.value }))}
                placeholder={label}
                className="w-full bg-gray-700 text-white px-3 py-2.5 rounded-xl border border-gray-600
                           focus:outline-none focus:border-blue-500 text-sm transition-colors
                           placeholder-gray-600"
            />
        </div>
    );

    return (
        <div className="bg-gray-800 border border-gray-700/50 rounded-2xl p-5 sm:p-6">
            <h2 className="text-white font-black text-lg mb-5 flex items-center gap-2">
                <Truck size={18} className="text-blue-400" />
                Shipping Details
            </h2>

            <div className="grid grid-cols-2 gap-4">
                <Field k="name" label="Full Name" />
                <Field k="email" label="Email Address" type="email" />
                <Field k="phone" label="Phone Number" type="tel" />
                <Field k="country" label="Country" />
                <Field k="address" label="Street Address" span />
                <Field k="city" label="City" />
                <Field k="state" label="State / Region" />
                <Field k="zip" label="ZIP / Postal Code" />
            </div>

            <button
                onClick={onNext}
                disabled={!canContinue}
                className="w-full mt-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50
                           text-white font-black py-4 rounded-2xl transition-all active:scale-[0.98]"
            >
                Continue to Payment →
            </button>
        </div>
    );
}