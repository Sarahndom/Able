import React from "react";
import { useAuth } from "../context/AuthContext";

function Settings() {
    const { logout } = useAuth();

    const handleDelete = () => {
        localStorage.clear();
        alert("Account deleted");
        window.location.reload();
    };

    return (
        <div>
            <h2>Settings</h2>

            <button onClick={logout}>Logout</button>

            <button onClick={handleDelete}>
                Delete Account
            </button>
        </div>
    );
}

export default Settings;