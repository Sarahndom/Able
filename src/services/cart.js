import { supabase } from "../supabaseClient";

export const addToCart = async (product) => {
    const user = (await supabase.auth.getUser()).data.user;

    await supabase.from("cart").insert({
        user_id: user.id,
        product_id: product.id,
        qty: 1,
    });
};

export const getCart = async () => {
    const user = (await supabase.auth.getUser()).data.user;

    const { data } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", user.id);

    return data;
};