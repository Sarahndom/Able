import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, ShieldCheck, AlertCircle, CheckCircle2, AlertTriangle, Eye, EyeOff } from "lucide-react";

export default function SecurityModal({
    modal, closeModal, isWrong, isDark, isProcessing, isSuccess, errorMessage,
    currentPassword, setCurrentPassword, showCurrentPass, setShowCurrentPass,
    newPassword, setNewPassword, showNewPass, setShowNewPass,
    confirmPassword, setConfirmPassword, showConfirmPass, setShowConfirmPass,
    handleVerifyPassword, handlePasswordUpdate
}) {
    const PasswordField = ({ value, onChange, show, onToggle, placeholder }) => (
        <div className="relative">
            <input
                type={show ? "text" : "password"} value={value} onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full bg-transparent border-2 rounded-2xl p-4 pr-12 text-center text-sm font-bold outline-none transition-all
                    ${isWrong ? 'border-red-500' : isDark ? 'border-gray-700 text-white focus:border-blue-500' : 'border-gray-300 text-black focus:border-blue-500'}`}
            />
            <button type="button" onClick={onToggle}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
        </div>
    );

    if (!modal.show) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, x: isWrong ? [-8, 8, -8, 8, 0] : 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`relative w-full max-w-md p-8 rounded-3xl shadow-2xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}
            >
                <button onClick={closeModal} className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors">
                    <X size={20} />
                </button>

                {isSuccess ? (
                    <div className="text-center py-4">
                        <CheckCircle2 size={64} className="text-green-500 mx-auto mb-5" />
                        <h2 className="text-xl font-black mb-2">Password Updated!</h2>
                        <p className="text-gray-500 text-sm mb-6">Your new password is active. Use it next time you sign in.</p>
                        <button onClick={closeModal} className="w-full py-3.5 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-500 transition-all">
                            Done
                        </button>
                    </div>
                ) : modal.step === "verify" ? (
                    <div className="text-center">
                        <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4 ${modal.type === 'delete' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                            {modal.type === 'delete' ? <AlertCircle size={28} /> : <ShieldCheck size={28} />}
                        </div>
                        <h2 className="text-xl font-black mb-1">{modal.type === 'password' ? 'Verify Identity' : 'Delete Account'}</h2>
                        {modal.type === 'delete' && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 my-4 text-left">
                                <div className="flex gap-3">
                                    <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-gray-400 text-xs leading-relaxed">
                                        This is <strong className="text-red-400">permanent and irreversible</strong>. Your account, all orders, and personal data will be permanently erased.
                                    </p>
                                </div>
                            </div>
                        )}
                        <p className="text-gray-500 text-xs mb-5 mt-3">{modal.type === 'delete' ? 'Enter your password to confirm' : 'Enter your current password to continue'}</p>
                        <PasswordField value={currentPassword} onChange={setCurrentPassword} show={showCurrentPass} onToggle={() => setShowCurrentPass(s => !s)} placeholder="Current Password" />
                        <div className="h-5 mt-2 mb-4">{errorMessage && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-[11px] font-bold">{errorMessage}</motion.p>}</div>
                        <div className="flex gap-3">
                            <button onClick={closeModal} className={`flex-1 py-3 rounded-2xl font-bold text-sm border transition-all ${isDark ? 'border-gray-700 text-gray-400 hover:text-white' : 'border-gray-300 text-gray-500'}`}>Cancel</button>
                            <button onClick={handleVerifyPassword} disabled={isProcessing} className={`flex-1 py-3 rounded-2xl font-black text-sm text-white transition-all disabled:opacity-50 ${modal.type === 'delete' ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'}`}>
                                {isProcessing ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying…</> : modal.type === 'delete' ? 'Confirm Delete' : 'Continue'}
                            </button>
                        </div>
                    </div>
                ) : modal.step === "new-password" ? (
                    <div className="text-center">
                        <div className="w-14 h-14 mx-auto rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4"><Lock size={28} /></div>
                        <h2 className="text-xl font-black mb-1">Set New Password</h2>
                        <p className="text-gray-500 text-xs mb-5">Must be at least 6 characters</p>
                        <div className="space-y-3 mb-2">
                            <PasswordField value={newPassword} onChange={setNewPassword} show={showNewPass} onToggle={() => setShowNewPass(s => !s)} placeholder="New Password" />
                            <PasswordField value={confirmPassword} onChange={setConfirmPassword} show={showConfirmPass} onToggle={() => setShowConfirmPass(s => !s)} placeholder="Confirm New Password" />
                        </div>
                        <div className="h-5 mb-5">{errorMessage && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-[11px] font-bold">{errorMessage}</motion.p>}</div>
                        <button onClick={handlePasswordUpdate} disabled={isProcessing} className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-2xl font-black transition-all">
                            {isProcessing ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating…</> : 'Update Password'}
                        </button>
                    </div>
                ) : null}
            </motion.div>
        </div>
    );
}