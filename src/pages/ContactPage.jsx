
/* ══════════════════════════════════════
   CONTACT
══════════════════════════════════════ */
import { useState } from "react";


function ContactPage({ showToast }) {
    const [f, setF] = useState({ name: '', email: '', subject: '', message: '' });
    const submit = e => { e.preventDefault(); showToast("Message sent! We'll reply within 24 hours 📬"); setF({ name: '', email: '', subject: '', message: '' }); };
    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="text-center mb-10"><h1 className="text-4xl font-black text-white mb-3">Contact Us</h1><p className="text-gray-400">We'd love to hear from you. Send a message and we'll respond promptly.</p></div>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    {[['📧', 'Email', 'support@electrostore.com'], ['📞', 'Phone', '+1 (555) 123-4567'], ['📍', 'Address', '123 Tech Street, Silicon Valley, CA 94102'], ['⏰', 'Hours', 'Mon–Fri: 9AM–6PM\nSat: 10AM–4PM EST']].map(([icon, l, v]) => (
                        <div key={l} className="bg-gray-800 rounded-2xl p-5 flex items-start gap-4">
                            <span className="text-2xl">{icon}</span>
                            <div><p className="text-white font-black text-sm">{l}</p><p className="text-gray-400 text-sm whitespace-pre-line">{v}</p></div>
                        </div>
                    ))}
                </div>
                <form onSubmit={submit} className="bg-gray-800 rounded-2xl p-6 space-y-4">
                    <h2 className="text-white font-black text-xl mb-1">Send a Message</h2>
                    {[['name', 'Your Name', 'text'], ['email', 'Email Address', 'email'], ['subject', 'Subject', 'text']].map(([k, ph, t]) => (
                        <input key={k} type={t} value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value })} placeholder={ph} required
                            className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:border-yellow-500 text-sm" />
                    ))}
                    <textarea value={f.message} onChange={e => setF({ ...f, message: e.target.value })} placeholder="Your message…" rows={4} required
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:border-yellow-500 text-sm resize-none" />
                    <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-3.5 rounded-2xl" style={{ transition: 'background .15s' }}>Send Message 📤</button>
                </form>
            </div>
        </div>
    );
}

export default ContactPage
