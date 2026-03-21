import { useState, useReducer, useEffect } from 'react';
import { supabase } from "./lib/supabase";

/* COMPONENTS */
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Toast from './components/ui/Toast';
import Loader from './pages/Loader';
import WelcomePage from './pages/WelcomePage';

/* PAGES */
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPassword from './pages/ForgotPassword';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LegalPage from './pages/LegalPage';
import OrderSuccessPage from './pages/OrderSuccessPage';

/* REDUCERS */
import { cartReducer } from './reducers/cartReducer';

export default function App() {

    /* =========================
       AUTH STATE (SUPABASE)
    ========================= */
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Get current session
        supabase.auth.getSession().then(({ data }) => {
            setUser(data.session?.user || null);
        });

        // Listen for auth changes
        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user || null);
            }
        );

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    /* =========================
       APP STATE
    ========================= */
    const [isLoading, setIsLoading] = useState(true);
    const [showWelcome, setShowWelcome] = useState(true);

    const [page, setPage] = useState({
        name: 'home',
        data: null,
        params: {}
    });

    const [cart, dispatch] = useReducer(cartReducer, []);
    const [toast, setToast] = useState(null);

    /* =========================
       NAVIGATION
    ========================= */
    const navigate = (name, data = null, params = {}) => {
        setShowWelcome(false);
        setPage({ name, data, params });
        window.scrollTo(0, 0);
    };

    /* =========================
       TOAST
    ========================= */
    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    /* =========================
       CART
    ========================= */
    const addToCart = (p) => {
        dispatch({ type: 'ADD', p });
        showToast(
            `${p.name.length > 28 ? p.name.slice(0, 28) + '…' : p.name} added!`
        );
    };

    /* =========================
       LOGOUT (REAL)
    ========================= */
    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        showToast('Logged out successfully');
        setShowWelcome(true);
        navigate('home');
    };

    /* =========================
       PAGE RENDERING
    ========================= */
    const renderPage = () => {
        const { name, data, params } = page;

        switch (name) {
            case 'home':
                return <HomePage onNav={navigate} onAdd={addToCart} />;

            case 'shop':
                return (
                    <ShopPage
                        key={`${params?.q || ''}-${params?.cat || ''}`}
                        onNav={navigate}
                        onAdd={addToCart}
                        initialQ={params?.q || ''}
                        initialCat={params?.cat || ''}
                    />
                );

            case 'product-detail':
                return (
                    <ProductDetailPage
                        product={data}
                        onAdd={addToCart}
                        onNav={navigate}
                    />
                );

            case 'cart':
                return (
                    <CartPage
                        cart={cart}
                        dispatch={dispatch}
                        onNav={navigate}
                    />
                );

            case 'checkout':
                return (
                    <CheckoutPage
                        cart={cart}
                        dispatch={dispatch}
                        user={user}
                        onNav={navigate}
                        showToast={showToast}
                    />
                );

            case 'login':
                return (
                    <LoginPage
                        setUser={setUser}
                        onNav={navigate}
                        showToast={showToast}
                    />
                );

            case 'signup':
                return (
                    <SignupPage
                        setUser={setUser}
                        onNav={navigate}
                        showToast={showToast}
                    />
                );

            case 'forgot':
                return (
                    <ForgotPassword
                        onNav={navigate}
                        showToast={showToast}
                    />
                );

            case 'dashboard':
                return (
                    <DashboardPage
                        user={user}
                        setUser={setUser}
                        onNav={navigate}
                        showToast={showToast}
                    />
                );

            case 'admin':
                if (user?.email === "admin@electrostore.com") {
                    return <AdminPage onNav={navigate} />;
                }
                return <HomePage onNav={navigate} onAdd={addToCart} />;

            case 'order-success':
                return <OrderSuccessPage onNav={navigate} />;

            case 'about':
                return <AboutPage />;

            case 'contact':
                return <ContactPage showToast={showToast} />;

            case 'privacy':
                return <LegalPage title="Privacy Policy" />;

            case 'terms':
                return <LegalPage title="Terms & Conditions" />;

            case 'refund':
                return <LegalPage title="Refund Policy" />;

            case 'shipping':
                return <LegalPage title="Shipping Policy" />;

            default:
                return <HomePage onNav={navigate} onAdd={addToCart} />;
        }
    };

    /* =========================
       APP FLOW
    ========================= */

    // Loader
    if (isLoading) {
        return <Loader onFinish={() => setIsLoading(false)} />;
    }

    // Welcome screen (only if not logged in)
    if (showWelcome && !user) {
        return <WelcomePage onNav={navigate} />;
    }

    /* =========================
       MAIN APP
    ========================= */
    return (
        <div className="min-h-screen bg-gray-950">
            <Navbar
                cart={cart}
                user={user}
                onNav={navigate}
                onLogout={logout}
            />

            <main>{renderPage()}</main>

            <Footer onNav={navigate} />

            {toast && <Toast msg={toast.msg} type={toast.type} />}
        </div>
    );
}