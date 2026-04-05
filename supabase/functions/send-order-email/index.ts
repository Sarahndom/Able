// supabase/functions/send-order-email/index.ts
// DEPLOY: supabase functions deploy send-order-email
//
// SECRETS (Supabase Dashboard → Edge Functions → Secrets):
//   RESEND_API_KEY  — from resend.com
//   SELLER_EMAIL    — where you want order alerts sent

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API   = "https://api.resend.com/emails";
const RESEND_KEY   = Deno.env.get("RESEND_API_KEY") ?? "";
const SELLER_EMAIL = Deno.env.get("SELLER_EMAIL")   ?? "sarahndom620@gmail.com";
const STORE_NAME   = "Able Enterprise";

// ✅ FIX for 403: use Resend's pre-verified domain until you verify ableenterprise.com
// To use your own domain: go to resend.com/domains → Add Domain → verify DNS records
// Then change this to: "Able Enterprise <noreply@ableenterprise.com>"
const FROM_EMAIL = "Able Enterprise <onboarding@resend.dev>";

const cors = {
    "Access-Control-Allow-Origin":  "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
        status,
        headers: { ...cors, "Content-Type": "application/json" },
    });

async function sendEmail(to: string, subject: string, html: string) {
    if (!RESEND_KEY) {
        console.warn("RESEND_API_KEY not set — skipping email to:", to);
        return;
    }
    const res = await fetch(RESEND_API, {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
    });
    if (!res.ok) {
        const err = await res.text();
        console.error("Resend error:", err);
    }
}

serve(async (req: Request) => {
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    let payload: Record<string, unknown>;
    try { payload = await req.json(); }
    catch { return json({ error: "Invalid JSON" }, 400); }

    const { type, order, form } = payload as {
        type: string;
        order?: Record<string, unknown>;
        form?: { name: string; email: string; subject: string; message: string };
    };

    /* ── CONTACT FORM ── */
    if (type === "contact" && form) {
        await Promise.allSettled([
            sendEmail(form.email,
                `We got your message — ${STORE_NAME}`,
                `<div style="font-family:system-ui;background:#0f172a;color:#fff;padding:32px;border-radius:12px;max-width:560px;margin:auto;">
                    <h2 style="color:#60a5fa;">Thanks for reaching out, ${form.name}! 👋</h2>
                    <p style="color:#94a3b8;">We'll get back to you within 24 hours.</p>
                    <div style="background:#1e293b;border-radius:8px;padding:16px;margin-top:16px;">
                        <p style="color:#94a3b8;font-size:12px;margin:0 0 4px;">Subject</p>
                        <p style="margin:0 0 12px;font-weight:600;">${form.subject}</p>
                        <p style="color:#94a3b8;font-size:12px;margin:0 0 4px;">Your message</p>
                        <p style="margin:0;line-height:1.6;">${form.message.replace(/\n/g, "<br>")}</p>
                    </div>
                </div>`
            ),
            sendEmail(SELLER_EMAIL,
                `Contact: ${form.subject} — from ${form.name}`,
                `<div style="font-family:system-ui;padding:24px;background:#fff;border-radius:8px;">
                    <h2>📬 New contact message</h2>
                    <p><strong>From:</strong> ${form.name} &lt;${form.email}&gt;</p>
                    <p><strong>Subject:</strong> ${form.subject}</p>
                    <hr/><p style="white-space:pre-wrap;">${form.message}</p>
                </div>`
            ),
        ]);
        return json({ ok: true });
    }

    /* ── ORDER CONFIRMED ── */
    if (type === "order_confirmed" && order) {
        const items = (order.items as Array<{name:string;qty:number;price:number}>) || [];
        const rows = items.map(i =>
            `<tr><td style="padding:8px 0;border-bottom:1px solid #1f2937;">${i.name}</td>
             <td style="padding:8px 0;border-bottom:1px solid #1f2937;text-align:center;">×${i.qty}</td>
             <td style="padding:8px 0;border-bottom:1px solid #1f2937;text-align:right;">$${(i.price*i.qty).toFixed(2)}</td></tr>`
        ).join("");

        await Promise.allSettled([
            sendEmail(order.customer_email as string,
                `Order Confirmed — ${STORE_NAME} 🎉`,
                `<div style="background:#0f172a;color:#fff;font-family:system-ui;padding:40px 20px;max-width:600px;margin:auto;border-radius:16px;">
                    <div style="text-align:center;margin-bottom:28px;">
                        <div style="background:#2563eb;width:56px;height:56px;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;font-weight:900;font-size:22px;color:#fff;">AE</div>
                        <h1 style="margin:12px 0 4px;">Order Confirmed! 🎉</h1>
                        <p style="color:#94a3b8;margin:0;">Thank you for shopping with ${STORE_NAME}</p>
                    </div>
                    <div style="background:#1e293b;border-radius:12px;padding:20px;margin-bottom:20px;">
                        <table style="width:100%;border-collapse:collapse;">${rows}</table>
                        <div style="border-top:1px solid #334155;margin-top:12px;padding-top:12px;">
                            <div style="display:flex;justify-content:space-between;"><span style="color:#94a3b8;">Shipping</span><span>${Number(order.shipping_cost)===0?"FREE":"$"+order.shipping_cost}</span></div>
                            <div style="display:flex;justify-content:space-between;font-weight:900;font-size:18px;margin-top:8px;"><span>Total</span><span style="color:#60a5fa;">$${order.total}</span></div>
                        </div>
                    </div>
                    <div style="background:#1e1b4b;border:1px solid #4c1d95;border-radius:12px;padding:20px;text-align:center;margin-bottom:20px;">
                        <p style="color:#a78bfa;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Your Delivery Code</p>
                        <p style="font-size:28px;font-weight:900;letter-spacing:8px;margin:0;">${order.delivery_code ?? "N/A"}</p>
                        <p style="color:#94a3b8;font-size:12px;margin:8px 0 0;">Give this code to the courier to confirm delivery.</p>
                    </div>
                    <p style="color:#94a3b8;font-size:12px;text-align:center;">Delivering to: ${order.shipping_address}</p>
                </div>`
            ),
            sendEmail(SELLER_EMAIL,
                `New Order from ${order.customer_name}`,
                `<div style="font-family:system-ui;padding:24px;background:#fff;">
                    <h2>🛒 New Order</h2>
                    <p><strong>Customer:</strong> ${order.customer_name} (${order.customer_email})</p>
                    <p><strong>Total:</strong> $${order.total} via ${order.payment_method}</p>
                    <p><strong>Address:</strong> ${order.shipping_address}</p>
                    <p><strong>Delivery Code:</strong> <strong style="font-size:18px;letter-spacing:4px;">${order.delivery_code}</strong></p>
                    <table style="width:100%;border-collapse:collapse;margin-top:12px;">${rows}</table>
                </div>`
            ),
        ]);
        return json({ ok: true });
    }

    /* ── DELIVERY CONFIRMED ── */
    if (type === "delivery_confirmed" && order) {
        const items = (order.items as Array<{name:string;qty:number;price:number}>) || [];
        const rows = items.map(i =>
            `<tr><td style="padding:6px 0;">${i.name}</td><td style="text-align:right;">×${i.qty} — $${(i.price*i.qty).toFixed(2)}</td></tr>`
        ).join("");
        const html = `<div style="background:#0f172a;color:#fff;font-family:system-ui;padding:40px 20px;max-width:600px;margin:auto;border-radius:16px;text-align:center;">
            <div style="font-size:56px;margin-bottom:12px;">✅</div>
            <h1 style="color:#22c55e;">Delivered!</h1>
            <p style="color:#94a3b8;">Your order has been confirmed as delivered.</p>
            <div style="background:#1e293b;border-radius:12px;padding:20px;margin:20px 0;text-align:left;">
                <table style="width:100%;border-collapse:collapse;">${rows}</table>
                <p style="text-align:right;font-weight:900;color:#60a5fa;margin-top:12px;">Total: $${order.total}</p>
            </div>
            <p style="color:#475569;font-size:12px;">Thanks for shopping with ${STORE_NAME}!</p>
        </div>`;
        await Promise.allSettled([
            sendEmail(order.customer_email as string, `Delivered — ${STORE_NAME}`, html),
            sendEmail(SELLER_EMAIL, `Order Delivered: ${order.id}`, html),
        ]);
        return json({ ok: true });
    }

    return json({ error: `Unknown type: "${type}"` }, 400);
});