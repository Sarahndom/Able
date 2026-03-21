// /* ══════════════════════════════════════
//    ABOUT
// ══════════════════════════════════════ */
// // import { AboutPage } from './pages/AboutPage';

// function AboutPage() {
//     return (
//         <div className="max-w-4xl mx-auto px-4 py-12">
//             <div className="text-center mb-12">
//                 <div className="w-20 h-20 bg-[#004792] rounded-3xl flex items-center justify-center mx-auto mb-5 font-black text-white text-4xl">E</div>
//                 <h1 className="text-4xl font-black text-white mb-3">About ElectroStore</h1>
//                 <p className="text-gray-400 text-lg">Your trusted partner for premium electronics since 2020</p>
//             </div>
//             <div className="grid md:grid-cols-3 gap-5 mb-10">
//                 {[['🎯 Our Mission', 'To make premium electronics accessible to everyone with competitive pricing and exceptional service, delivered right to your door.'],
//                 ['👁 Our Vision', 'To become the leading e-commerce destination for electronics by 2026, known for quality, trust, and innovation.'],
//                 ['💎 Our Values', 'Quality, transparency, and customer satisfaction are at the core of every decision we make.']].map(([t, d]) => (
//                     <div key={t} className="bg-gray-800 rounded-2xl p-6"><h3 className="text-[#004792] font-black text-lg mb-3">{t}</h3><p className="text-gray-400 text-sm leading-relaxed">{d}</p></div>
//                 ))}
//             </div>
//             <div className="bg-gray-800 rounded-2xl p-8 mb-8">
//                 <h2 className="text-2xl font-black text-white mb-5">Our Story</h2>
//                 <div className="space-y-4 text-gray-300 leading-relaxed text-sm">
//                     <p>Founded in 2020, ElectroStore started with a simple idea: make buying premium electronics online easy, affordable, and trustworthy. What began as a small passion project has grown into a platform serving thousands of happy customers.</p>
//                     <p>We work directly with leading brands including Samsung, Apple, Sony, LG, and more to bring you the latest technology at prices that won't break the bank. Every product is carefully verified for authenticity and quality.</p>
//                     <p>Our team of tech enthusiasts is dedicated to helping you find exactly what you need — whether you're upgrading your home entertainment setup, searching for the perfect smartphone, or looking for the right accessories to complement your devices.</p>
//                 </div>
//                 <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-700">
//                     {[['10K+', 'Happy Customers'], ['500+', 'Products'], ['4.9/5', 'Avg Rating']].map(([n, l]) => (
//                         <div key={l} className="text-center"><p className="text-3xl font-black text-[#004792] mb-1">{n}</p><p className="text-gray-500 text-sm">{l}</p></div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default AboutPage;




/* ══════════════════════════════════════
   ABOUT
══════════════════════════════════════ */
// import { AboutPage } from './pages/AboutPage';

function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <div className="w-20 h-20 bg-[#0066FF] rounded-3xl flex items-center justify-center mx-auto mb-5 font-black text-white text-4xl">E</div>
                <h1 className="text-4xl font-black text-white mb-3">About ElectroStore</h1>
                <p className="text-gray-400 text-lg">Your trusted partner for premium electronics since 2020</p>
            </div>
            <div className="grid md:grid-cols-3 gap-5 mb-10">
                {[['🎯 Our Mission', 'To make premium electronics accessible to everyone with competitive pricing and exceptional service, delivered right to your door.'],
                ['👁 Our Vision', 'To become the leading e-commerce destination for electronics by 2026, known for quality, trust, and innovation.'],
                ['💎 Our Values', 'Quality, transparency, and customer satisfaction are at the core of every decision we make.']].map(([t, d]) => (
                    <div key={t} className="bg-gray-800 rounded-2xl p-6"><h3 className="text-[#0066FF] font-black text-lg mb-3">{t}</h3><p className="text-gray-400 text-sm leading-relaxed">{d}</p></div>
                ))}
            </div>
            <div className="bg-gray-800 rounded-2xl p-8 mb-8">
                <h2 className="text-2xl font-black text-white mb-5">Our Story</h2>
                <div className="space-y-4 text-gray-300 leading-relaxed text-sm">
                    <p>Founded in 2016, ElectroStore started with a simple idea: make buying premium electronics online easy, affordable, and trustworthy. What began as a small passion project has grown into a platform serving thousands of happy customers.</p>
                    <p>We work directly with leading brands including Samsung, Apple, Sony, LG, and more to bring you the latest technology at prices that won't break the bank. Every product is carefully verified for authenticity and quality.</p>
                    <p>Our team of tech enthusiasts is dedicated to helping you find exactly what you need — whether you're upgrading your home entertainment setup, searching for the perfect smartphone, or looking for the right accessories to complement your devices.</p>
                </div>
                <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-700">
                    {[['10K+', 'Happy Customers'], ['500+', 'Products'], ['4.9/5', 'Avg Rating']].map(([n, l]) => (
                        <div key={l} className="text-center"><p className="text-3xl font-black text-[#0066FF] mb-1">{n}</p><p className="text-gray-500 text-sm">{l}</p></div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AboutPage;