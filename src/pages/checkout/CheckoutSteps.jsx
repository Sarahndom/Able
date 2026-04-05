// import React from "react";
// // import { CheckCircle2 } from "lucide-react";
// import { CheckCircle2, Truck, CreditCard, ClipboardCheck } from "lucide-react"; // ✅ FIXED: Added imports

// const STEP_ICONS = [<Truck size={16} />, <CreditCard size={16} />, <ClipboardCheck size={16} />];
// const STEP_LABELS = ["Shipping", "Payment", "Review"];

// export default function CheckoutSteps({ step, stepIcons, stepLabels }) {
//     return (


//         <div className="flex items-center mb-8 overflow-x-auto pb-1">

//             {STEP_LABELS.map((label, i) => (
//                 <div key={label} className="flex items-center flex-shrink-0">
//                     <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black flex-shrink-0 transition-all ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-blue-600 text-white ring-4 ring-blue-600/20' : 'bg-gray-700 text-gray-500'}`}>
//                         {step > i + 1 ? <CheckCircle2 size={18} /> : STEP_ICONS[i]}
//                     </div>
//                     <span className={`ml-2 text-sm font-semibold whitespace-nowrap ${step === i + 1 ? 'text-white' : 'text-gray-600'}`}>{label}</span>
//                     {i < 2 && <div className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-3 flex-shrink-0 transition-all ${step > i + 1 ? 'bg-green-500' : 'bg-gray-700'}`} />}
//                 </div>
//             ))}
//         </div>

//     )

// }


import { CheckCircle2, Truck, CreditCard, ClipboardCheck } from "lucide-react";

const STEP_ICONS = [<Truck size={16} />, <CreditCard size={16} />, <ClipboardCheck size={16} />];
const STEP_LABELS = ["Shipping", "Payment", "Review"];

export default function CheckoutSteps({ step }) {
    return (
        <div className="flex items-center mb-8 overflow-x-auto pb-1">
            {STEP_LABELS.map((label, i) => (
                <div key={label} className="flex items-center flex-shrink-0">
                    <div className={`
                        w-9 h-9 rounded-full flex items-center justify-center font-black flex-shrink-0 transition-all
                        ${step > i + 1 ? "bg-green-500 text-white"
                            : step === i + 1 ? "bg-blue-600 text-white ring-4 ring-blue-600/20"
                                : "bg-gray-700 text-gray-500"}
                    `}>
                        {step > i + 1 ? <CheckCircle2 size={18} /> : STEP_ICONS[i]}
                    </div>

                    <span className={`ml-2 text-sm font-semibold whitespace-nowrap ${step === i + 1 ? "text-white" : "text-gray-600"}`}>
                        {label}
                    </span>

                    {i < 2 && (
                        <div className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-3 flex-shrink-0 transition-all ${step > i + 1 ? "bg-green-500" : "bg-gray-700"}`} />
                    )}
                </div>
            ))}
        </div>
    );
}