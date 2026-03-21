import { useState } from "react";

export const Toast = ({ msg, type }) => (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold flex items-center gap-2 ${type === 'error' ? 'bg-red-600' : 'bg-green-600'} text-white`}>
        <span>{type === 'error' ? '✗' : '✓'}</span>
        {msg}
    </div>
);

export default Toast;