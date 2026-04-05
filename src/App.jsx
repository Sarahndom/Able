// App.jsx
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { useCart } from "./context/CartContext";

import Navbar           from "./components/layout/Navbar";
import Footer           from "./components/layout/Footer";
import Toast            from "./components/ui/Toast";
import Loader           from "./pages/Loader";
import WelcomePage      from "./pages/WelcomePage";
import HomePage         from "./pages/HomePage";
import ShopPage         from "./pages/ShopPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage         from "./pages/CartPage";
import CheckoutPage     from "./pages/checkout/CheckoutPage";
import LoginPage        from "./pages/logins/LoginPage";
import SignupPage       from "./pages/SignupPage";
import ForgotPassword   from "./pages/ForgotPassword";
import DashboardPage    from "./pages/Dashboard/DashboardPage";
import AdminPage        from "./pages/AdminPage";
import AboutPage        from "./pages/AboutPage";
import ContactPage      from "./pages/ContactPage";
import LegalPage        from "./pages/LegalPage";
import TermsPage        from "./pages/Terms";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import WishlistPage     from "./pages/Wishlist";
import ProfileSetupPage from "./pages/ProfileSetupPage";

// These pages need a logged-in user
const AUTH_REQUIRED = ["cart", "checkout", "dashboard", "order-success", "wishlist", "profile-setup"];

export default function App() {
    const { addToCart, clearCart } = useCart();

    const [user, setUser]               = useState(null);
    const [isLoading, setIsLoading]     = useState(true);
    const [showWelcome, setShowWelcome] = useState(true);
    const [page, setPage]               = useState({ name: "home", data: null, params: {} });
    const [toast, setToast]             = useState(null);

    /* ══════════════════════════════════════════════════════
       SESSION — Supabase is the only source of truth.
       We NEVER clear the user on navigation — only on
       a real SIGNED_OUT event. This fixes the cart logout bug.
    ══════════════════════════════════════════════════════ */
    useEffect(() => {
        const buildUser = async (supaUser) => {
            const { data: profile } = await supabase
                .from("profiles")
                .select("full_name, pass, deleted, phone, address, avatar_url")
                .eq("id", supaUser.id)
                .single();

            if (profile?.deleted) { await supabase.auth.signOut(); return; }

            const userData = {
                id:          supaUser.id,
                name:        profile?.full_name || supaUser.user_metadata?.full_name || supaUser.email.split("@")[0],
                email:       supaUser.email,
                role:        supaUser.email === "admin@electrostore.com" ? "admin" : "user",
                phone:       profile?.phone   || "",
                address:     profile?.address || "",
                avatarUrl:   profile?.avatar_url || null,
                pass:        profile?.pass    || "",
                memberSince: supaUser.created_at,
            };
            setUser(userData);
            setShowWelcome(false);
            localStorage.setItem("able_user", JSON.stringify(userData));
        };

        // Restore session on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                buildUser(session.user).finally(() => setIsLoading(false));
            } else {
                setIsLoading(false);
            }
        });

        // Only react to REAL auth events, not navigation
        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_IN" && session?.user) {
                buildUser(session.user);
            }
            if (event === "SIGNED_OUT") {
                setUser(null);
                localStorage.removeItem("able_user");
                setShowWelcome(true);
            }
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    /* ── Navigation ── */
    const navigate = (name, data = null, params = {}) => {
        setShowWelcome(false);

        // Guests trying to access protected pages → login
        if (!user && AUTH_REQUIRED.includes(name)) {
            showToast("Please sign in to continue", "error");
            setPage({ name: "login", data: null, params: {} });
            window.scrollTo(0, 0);
            return;
        }

        if (name === "admin") {
            const ok = user?.role === "admin" || user?.email === "admin@electrostore.com";
            if (!ok) { navigate("home"); return; }
        }

        setPage({ name, data, params });
        window.scrollTo(0, 0);
    };

    /* ── Add to cart — guests CAN add (badge shows), but viewing cart needs login ── */
    const handleAddToCart = (product) => {
        addToCart(product);     // always succeeds — badge increments for everyone
        if (!user) {
            showToast(`${product.name.slice(0, 26)}… added! Sign in to checkout.`);
        } else {
            showToast(`${product.name.slice(0, 28)}… added to cart!`);
        }
    };

    /* ── Logout ── */
    const logout = async () => {
        await supabase.auth.signOut();
        clearCart();
        showToast("Signed out successfully");
    };

    /* ── Page renderer ── */
    const renderPage = () => {
        const { name, data, params } = page;
        switch (name) {
            case "home":           return <HomePage onNav={navigate} onAdd={handleAddToCart} user={user} />;
            case "shop":           return <ShopPage key={`${params?.q}-${params?.cat}`} onNav={navigate} onAdd={handleAddToCart} initialQ={params?.q || ""} initialCat={params?.cat || ""} />;
            case "product-detail": return <ProductDetailPage product={data} onAdd={handleAddToCart} onNav={navigate} />;
            case "cart":           return <CartPage onNav={navigate} />;
            case "checkout":       return <CheckoutPage user={user} onNav={navigate} showToast={showToast} />;
            case "login":          return <LoginPage setUser={setUser} onNav={navigate} showToast={showToast} />;
            case "signup":         return <SignupPage onNav={navigate} showToast={showToast} />;
            case "forgot":         return <ForgotPassword onNav={navigate} showToast={showToast} />;
            case "dashboard":      return <DashboardPage user={user} setUser={setUser} onNav={navigate} showToast={showToast} />;
            case "profile-setup":  return <ProfileSetupPage user={user} setUser={setUser} onNav={navigate} showToast={showToast} />;
            case "admin": {
                const ok = user?.role === "admin" || user?.email === "admin@electrostore.com";
                return ok ? <AdminPage onNav={navigate} /> : <HomePage onNav={navigate} onAdd={handleAddToCart} user={user} />;
            }
            case "wishlist":       return <WishlistPage onNav={navigate} onAdd={handleAddToCart} user={user} />;
            case "order-success":  return <OrderSuccessPage onNav={navigate} />;
            case "about":          return <AboutPage />;
            case "contact":        return <ContactPage showToast={showToast} />;
            case "privacy":        return <LegalPage title="Privacy Policy" />;
            case "terms":          return <TermsPage onNav={navigate} />;
            case "refund":         return <LegalPage title="Refund Policy" />;
            case "shipping":       return <LegalPage title="Shipping Policy" />;
            default:               return <HomePage onNav={navigate} onAdd={handleAddToCart} user={user} />;
        }
    };

    if (isLoading)            return <Loader onFinish={() => {}} />;
    if (showWelcome && !user) return <WelcomePage onNav={navigate} />;

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col">
            <Navbar user={user} onNav={navigate} onLogout={logout} showToast={showToast} />
            <main className="flex-1">{renderPage()}</main>
            <Footer onNav={navigate} />
            {toast && <Toast msg={toast.msg} type={toast.type} />}
        </div>
    );
}