import { CATS } from "../../data/products";

export default function Footer({ onNav }) {
    return (
        <footer className="bg-gray-900 border-t border-gray-800 mt-16">
            <div className="max-w-7xl mx-auto px-4 py-10 sm:py-12 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">

                {/* Brand */}
                <div className="col-span-2 md:col-span-1">
                    <button
                        onClick={() => onNav('home')}
                        className="flex items-center gap-2 mb-3"
                    >
                        <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white">
                            AE
                        </div>
                        <span className="font-black text-lg text-white">
                            Able<span className="text-blue-400">Enterprise</span>
                        </span>
                    </button>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Your one-stop shop for premium electronics.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <p className="text-white font-bold mb-3 text-sm">Quick Links</p>
                    <div className="space-y-2">
                        {[
                            ['shop', 'Shop'],
                            ['about', 'About Us'],
                            ['contact', 'Contact'],
                            ['dashboard', 'My Account']
                        ].map(([p, l]) => (
                            <button
                                key={p}
                                onClick={() => onNav(p)}
                                className="block text-gray-500 hover:text-blue-400 text-sm transition-colors"
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Categories */}
                <div>
                    <p className="text-white font-bold mb-3 text-sm">Categories</p>
                    <div className="space-y-2">
                        {CATS.map(c => (
                            <button
                                key={c}
                                onClick={() => onNav('shop', null, { cat: c })}
                                className="block text-gray-500 hover:text-blue-400 text-sm transition-colors"
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Legal */}
                <div>
                    <p className="text-white font-bold mb-3 text-sm">Legal</p>
                    <div className="space-y-2">
                        {[
                            ['privacy', 'Privacy Policy'],
                            ['terms', 'Terms & Conditions'],
                            ['refund', 'Refund Policy'],
                            ['shipping', 'Shipping Policy']
                        ].map(([p, l]) => (
                            <button
                                key={p}
                                onClick={() => onNav(p)}
                                className="block text-gray-500 hover:text-blue-400 text-sm transition-colors"
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-800 py-5 text-center text-gray-600 text-sm px-4">
                © 2026 AbleEnterprise. All rights reserved.
            </div>
        </footer>
    );
}