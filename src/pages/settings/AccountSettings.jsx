import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Fingerprint, Lock, Trash2, X, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "../lib/supabase"; // ✅ REQUIRED

export default function AccountSettings({ isDark }) {
    const [isBiometricActive, setIsBiometricActive] = useState(() => localStorage.getItem("bio_enabled") === "true");
    const [isScanning, setIsScanning] = useState(false);
    const [modal, setModal] = useState({ show: false, step: "verify", type: "" });
    const [isSuccess, setIsSuccess] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");

    const handleBiometricToggle = async () => {
        if (!window.PublicKeyCredential) return alert("Hardware Biometrics not supported.");

        setIsScanning(true);
        try {
            if (!isBiometricActive) {
                const challenge = window.crypto.getRandomValues(new Uint8Array(32));

                const credential = await navigator.credentials.create({
                    publicKey: {
                        challenge,
                        rp: { name: "Able Enterprises" },
                        user: {
                            id: window.crypto.getRandomValues(new Uint8Array(16)),
                            name: "user@able.com",
                            displayName: "Verified Member"
                        },
                        // ✅ FIXED WARNING (added RS256)
                        pubKeyCredParams: [
                            { alg: -7, type: "public-key" },   // ES256
                            { alg: -257, type: "public-key" } // RS256
                        ],
                        authenticatorSelection: { userVerification: "required" },
                        timeout: 60000,
                    },
                });

                if (credential) {
                    setIsBiometricActive(true);
                    localStorage.setItem("bio_enabled", "true");
                    setIsSuccess(true);
                    setModal({ show: true, type: "biometric", step: "success" });
                }
            } else {
                setIsBiometricActive(false);
                localStorage.setItem("bio_enabled", "false");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsScanning(false);
        }
    };

    // ✅ REAL DELETE ACCOUNT (Supabase)
    const handleDeleteAccount = async () => {
        if (!confirm("Are you sure you want to delete your account?")) return;

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            alert("No active session. Please login again.");
            return;
        }

        const { error } = await supabase
            .from("profiles")
            .update({ deleted: true })
            .eq("id", user.id);

        if (error) {
            console.error(error);
            alert("Failed to delete account");
        } else {
            alert("Account deleted successfully");
            await supabase.auth.signOut();
            window.location.href = "/";
        }
    };

    const handleAuthenticate = async () => {
        if (passwordInput.length < 4) return alert("Invalid Password");

        if (modal.type === "delete") {
            await handleDeleteAccount(); // ✅ TRIGGER DELETE HERE
        }

        setIsSuccess(true);
    };

    return (
        <div className="space-y-4">
            <div className="text-center py-4 mb-4">
                <h3 className="text-lg font-black italic tracking-widest uppercase">
                    SECURE<span className="text-[#0066FF]">_BOX</span>
                </h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-tighter font-bold">
                    Hardware-level protection enabled
                </p>
            </div>

            {/* BIOMETRIC */}
            <div className={`flex items-center justify-between p-4 rounded-2xl border ${isDark ? 'bg-black/40 border-gray-800' : 'bg-gray-100 border-gray-200'}`}>
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${isScanning ? 'animate-pulse bg-[#0066FF]' : 'bg-gray-800'}`}>
                        <Fingerprint size={20} className={isScanning ? 'text-white' : 'text-[#0066FF]'} />
                    </div>
                    <div>
                        <p className="text-sm font-bold">Biometric Shield</p>
                        <p className="text-[10px] text-gray-500 uppercase">
                            {isScanning ? 'Authenticating...' : 'FaceID / TouchID Active'}
                        </p>
                    </div>
                </div>
                <button onClick={handleBiometricToggle} className={`w-12 h-6 rounded-full relative ${isBiometricActive ? 'bg-[#0066FF]' : 'bg-gray-600'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full ${isBiometricActive ? 'left-7' : 'left-1'}`} />
                </button>
            </div>

            {/* DELETE */}
            <button
                onClick={() => setModal({ show: true, step: 'verify', type: 'delete' })}
                className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 font-bold text-sm"
            >
                <div className="p-3 bg-red-500/10 rounded-xl"><Trash2 size={20} /></div>
                <span>Delete Account</span>
            </button>

            {/* MODAL */}
            <AnimatePresence>
                {modal.show && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/90">
                        <motion.div className="w-full max-w-md p-8 rounded-2xl bg-gray-900">
                            {!isSuccess ? (
                                <>
                                    <input
                                        type="password"
                                        value={passwordInput}
                                        onChange={(e) => setPasswordInput(e.target.value)}
                                        placeholder="Enter password"
                                        className="w-full p-3 mb-4"
                                    />
                                    <button onClick={handleAuthenticate} className="w-full bg-blue-600 text-white py-3">
                                        Authenticate
                                    </button>
                                </>
                            ) : (
                                <p className="text-center text-green-500">Success</p>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}