
/* ══════════════════════════════════════
   LEGAL PAGES
══════════════════════════════════════ */
const LEGAL = {
    'Privacy Policy': [
        ['Information We Collect', 'We collect information you provide when creating an account, making purchases, or contacting support — including name, email, address, payment info, and order history. We may also collect usage data through cookies.'],
        ['How We Use Your Information', 'We use your data to process transactions, send confirmations and promotional emails, improve our services, and provide customer support. We do not sell your personal information to third parties.'],
        ['Data Security', 'We implement industry-standard encryption (TLS/SSL) and security measures to protect your personal data. Payment information is handled by PCI-compliant processors.'],
        ['Cookies & Tracking', 'We use cookies to improve your browsing experience and analyze site traffic. You can control cookie settings through your browser preferences.'],
        ['Contact', 'Questions about this policy? Email us at privacy@electrostore.com.'],
    ],
    'Terms & Conditions': [
        ['Acceptance', 'By using ElectroStore, you agree to be bound by these terms. If you do not agree, please do not use our services.'],
        ['Products & Pricing', 'All prices are in USD and subject to change. We reserve the right to discontinue products without notice. Product images are representative.'],
        ['Orders & Payment', 'By placing an order, you confirm you are 18+ and authorized to use the payment method. Orders are subject to availability and acceptance.'],
        ['Limitation of Liability', 'ElectroStore is not liable for indirect, consequential, or punitive damages arising from use of our products or services.'],
        ['Governing Law', 'These terms are governed by the laws of the State of California, USA.'],
    ],
    'Refund Policy': [
        ['Return Window', 'You have 30 days from delivery to return most items for a full refund, no questions asked.'],
        ['Condition Requirements', 'Items must be returned unused, in original packaging, with all accessories and documentation included.'],
        ['Refund Process', 'Upon receipt and inspection, approved refunds are processed within 3–5 business days to your original payment method.'],
        ['Non-Returnable Items', 'Opened software, digital downloads, and items damaged through misuse are not eligible for return.'],
        ['Start a Return', 'Contact support@electrostore.com or call +1 (555) 123-4567 with your order ID to initiate a return.'],
    ],
    'Shipping Policy': [
        ['Shipping Methods', 'Standard (5–7 days, free over $50), Express (2–3 days, $12.99), Next Day ($24.99).'],
        ['Processing Time', 'Orders are processed within 1–2 business days. You will receive tracking info once shipped.'],
        ['International Shipping', 'We ship to the US and Canada. International rates and delivery times vary by destination.'],
        ['Free Shipping', 'All orders over $50 within the continental US qualify for free standard shipping automatically.'],
        ['Damaged Shipments', 'Contact us within 48 hours with photos if your order arrives damaged. We will replace it or issue a refund.'],
    ],
};

function LegalPage({ title }) {
    const sections = LEGAL[title] || [];
    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-black text-white mb-1">{title}</h1>
            <p className="text-gray-500 text-sm mb-10">Last updated: January 2025</p>
            <div className="space-y-8">
                {sections.map(([h, b]) => (
                    <div key={h} className="bg-gray-800/50 rounded-2xl p-6">
                        <h2 className="text-yellow-400 font-black text-lg mb-3">{h}</h2>
                        <p className="text-gray-300 leading-relaxed text-sm">{b}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LegalPage