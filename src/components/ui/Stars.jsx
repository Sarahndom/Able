import { useState } from "react";


export const Stars = ({ r }) => (
    <span className="text-yellow-400 text-xs tracking-tight">
        {'★'.repeat(Math.round(r))}
        {'☆'.repeat(5 - Math.round(r))}
    </span>
);

export default Stars;