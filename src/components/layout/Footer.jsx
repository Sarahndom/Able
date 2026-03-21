/* ══════════════════════════════════════
   FOOTER
══════════════════════════════════════ */
import { useState } from "react";
import { CATS } from "../../data/products";

export default function Footer({ onNav }) {
    return (
        <footer className="bg-gray-900 border-t border-gray-800 mt-16">
            <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <div className="flex items-center gap-2 mb-3 cursor-pointer" onClick={() => onNav('home')}>
                        <div className="w-8 h-8 bg-yellow-500 rounded-xl flex items-center justify-center font-black text-black">E</div>
                        <span className="font-black text-lg text-white">Electro<span className="text-yellow-500">Store</span></span>
                    </div>
                    <p className="text-gray-500 text-sm">Your one-stop shop for premium electronics.</p>
                </div>
                <div>
                    <p className="text-white font-bold mb-3 text-sm">Quick Links</p>
                    <div className="space-y-2">{[['shop', 'Shop'], ['about', 'About Us'], ['contact', 'Contact'], ['dashboard', 'My Account']].map(([p, l]) => (
                        <button key={p} onClick={() => onNav(p)} className="block text-gray-500 hover:text-yellow-400 text-sm" style={{ transition: 'color .15s' }}>{l}</button>
                    ))}</div>
                </div>
                <div>
                    <p className="text-white font-bold mb-3 text-sm">Categories</p>
                    <div className="space-y-2">{CATS.map(c => (
                        <button key={c} onClick={() => onNav('shop', null, { cat: c })} className="block text-gray-500 hover:text-yellow-400 text-sm" style={{ transition: 'color .15s' }}>{c}</button>
                    ))}</div>
                </div>
                <div>
                    <p className="text-white font-bold mb-3 text-sm">Legal</p>
                    <div className="space-y-2">{[['privacy', 'Privacy Policy'], ['terms', 'Terms & Conditions'], ['refund', 'Refund Policy'], ['shipping', 'Shipping Policy']].map(([p, l]) => (
                        <button key={p} onClick={() => onNav(p)} className="block text-gray-500 hover:text-yellow-400 text-sm" style={{ transition: 'color .15s' }}>{l}</button>
                    ))}</div>
                </div>
            </div>
            <div className="border-t border-gray-800 py-5 text-center text-gray-600 text-sm">© 2025 ElectroStore. All rights reserved. Built with React & TailwindCSS.</div>
        </footer>
    );
}
