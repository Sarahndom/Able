import { useState } from "react";
import { supabase } from "../lib/supabase";

function UpdatePassword({ showToast }) {
    const [pass, setPass] = useState("");

    const update = async (e) => {
        e.preventDefault();

        const { error } = await supabase.auth.updateUser({
            password: pass,
        });

        if (error) return showToast(error.message, "error");

        showToast("Password updated successfully!");
    };

    return (
        <form onSubmit={update}>
            <input
                type="password"
                placeholder="New password"
                onChange={(e) => setPass(e.target.value)}
            />
            <button type="submit">Update Password</button>
        </form>
    );
}

export default UpdatePassword;