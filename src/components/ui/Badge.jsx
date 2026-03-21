import { useState } from "react";

export const Badge = ({ status }) => {
    const map = {
        Delivered: 'bg-green-900 text-green-300',
        Shipped: 'bg-blue-900 text-blue-300',
        Processing: 'bg-yellow-900 text-yellow-300',
        Pending: 'bg-gray-700 text-gray-300',
        Cancelled: 'bg-red-900 text-red-300',
        Paid: 'bg-green-900 text-green-300',
        In_Stock: 'bg-green-900 text-green-300',
        Out_of_Stock: 'bg-red-900 text-red-300'
    };

    return (
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${map[status.replace(' ', '_')]}`}>
            {status}
        </span>
    );
};

export default Badge;