function TermsPage({ onNav }) {
    const sections = [
        {
            title: "1. Acceptance of Terms",
            content: `By accessing or using Able Enterprise ("the Site"), you agree to be legally bound by these Terms and Conditions. If you do not agree to any part of these terms, you must not use our services. We reserve the right to update these terms at any time. Continued use of the Site after changes constitutes acceptance of the new terms.`
        },
        {
            title: "2. Eligibility",
            content: `You must be at least 18 years of age to create an account and make purchases on Able Enterprise. By using the Site, you represent and warrant that you meet this age requirement and that all information you provide is accurate and complete.`
        },
        {
            title: "3. Account Registration",
            content: `To access certain features, you may be required to register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to notify us immediately of any unauthorized access or use of your account.`
        },
        {
            title: "4. Products & Pricing",
            content: `All prices displayed on the Site are in US Dollars (USD) and are subject to change without notice. We reserve the right to limit quantities, discontinue products, or modify product descriptions at any time. Product images are for illustrative purposes and may not perfectly represent the physical item. We make every effort to display accurate product information but do not warrant that descriptions are error-free.`
        },
        {
            title: "5. Orders & Payment",
            content: `By placing an order, you confirm that you are authorized to use the payment method provided and that the billing information is accurate. All orders are subject to availability and acceptance by Able Enterprise. We reserve the right to cancel or refuse any order at our discretion. Payment is required in full before your order is processed. We accept major credit/debit cards and PayPal.`
        },
        {
            title: "6. Shipping & Delivery",
            content: `We aim to ship all orders within 1–2 business days of payment confirmation. Delivery times vary based on selected shipping method and destination. Able Enterprise is not responsible for delays caused by third-party carriers, customs, or other factors outside our control. Risk of loss and title for items pass to you upon delivery to the carrier.`
        },
        {
            title: "7. Returns & Refunds",
            content: `We offer a 30-day return policy for most items. Products must be returned unused, in original packaging, with all accessories and documentation. Refunds are processed within 3–5 business days of receipt and inspection. Opened software, digital downloads, and items damaged through misuse are not eligible for return. Shipping costs for returns are the customer's responsibility unless the item was received damaged or incorrect.`
        },
        {
            title: "8. Intellectual Property",
            content: `All content on the Able Enterprise website — including but not limited to text, graphics, logos, images, and software — is the property of Able Enterprise or its content suppliers and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written consent.`
        },
        {
            title: "9. Prohibited Activities",
            content: `You agree not to: (a) use the Site for unlawful purposes; (b) attempt to gain unauthorized access to any part of the Site; (c) transmit harmful, offensive, or disruptive content; (d) interfere with or disrupt the security or integrity of the Site; (e) use automated systems to scrape or extract data without permission; (f) impersonate any person or entity.`
        },
        {
            title: "10. Disclaimer of Warranties",
            content: `The Site and all products are provided "as is" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. Able Enterprise does not warrant that the Site will be uninterrupted, error-free, or free of viruses.`
        },
        {
            title: "11. Limitation of Liability",
            content: `To the maximum extent permitted by law, Able Enterprise and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including loss of profits, data, or goodwill — arising from your use of the Site or our products, even if advised of the possibility of such damages.`
        },
        {
            title: "12. Privacy",
            content: `Your use of the Site is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the Site, you consent to the collection and use of your information as described in the Privacy Policy.`
        },
        {
            title: "13. Governing Law",
            content: `These Terms and Conditions are governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law principles. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in California.`
        },
        {
            title: "14. Contact Us",
            content: `If you have any questions about these Terms and Conditions, please contact us at:\n\nAble Enterprise Legal Department\nEmail: legal@Able Enterprise.com\nPhone: +1 (555) 123-4567\nAddress: 123 Tech Street, Silicon Valley, CA 94102`
        },
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">

            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Terms & Conditions</h1>
                <p className="text-gray-500 text-sm">Last updated: January 2026</p>
                <div className="mt-4 p-4 bg-blue-600/10 border border-blue-600/20 rounded-2xl">
                    <p className="text-blue-300 text-sm leading-relaxed">
                        Please read these Terms and Conditions carefully before using Able Enterprise. By accessing or making a purchase on our site, you agree to be bound by these terms.
                    </p>
                </div>
            </div>

            {/* Table of Contents */}
            <div className="bg-gray-800/50 rounded-2xl p-6 mb-10 border border-gray-700/50">
                <h2 className="text-white font-black text-base mb-4">Table of Contents</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {sections.map((s, i) => (
                        <a
                            key={i}
                            href={`#section-${i}`}
                            className="text-blue-400 hover:text-blue-300 text-sm transition-colors truncate"
                        >
                            {s.title}
                        </a>
                    ))}
                </div>
            </div>

            {/* Sections */}
            <div className="space-y-6">
                {sections.map((s, i) => (
                    <div
                        key={i}
                        id={`section-${i}`}
                        className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 scroll-mt-20"
                    >
                        <h2 className="text-blue-400 font-black text-lg mb-3">{s.title}</h2>
                        <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-line">{s.content}</p>
                    </div>
                ))}
            </div>

            {/* Footer actions */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-between pt-8 border-t border-gray-800">
                <p className="text-gray-600 text-sm">
                    © 2026 Able Enterprise. All rights reserved.
                </p>
                <div className="flex gap-3">
                    {onNav && (
                        <>
                            <button
                                onClick={() => onNav('privacy')}
                                className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                            >
                                Privacy Policy
                            </button>
                            <span className="text-gray-700">·</span>
                            <button
                                onClick={() => onNav('refund')}
                                className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                            >
                                Refund Policy
                            </button>
                            <span className="text-gray-700">·</span>
                            <button
                                onClick={() => onNav('contact')}
                                className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                            >
                                Contact Us
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TermsPage;