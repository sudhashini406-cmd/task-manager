import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { LockKeyhole, Eye, EyeOff } from 'lucide-react';

function z() {
  const [c, m] = useState(null), [e, b] = useState(""), [r, y] = useState(""), [a, P] = useState(false), [i, v] = useState(false), [p, S] = useState([]), [u, h] = useState("");
  useEffect(() => {
    const n = new URLSearchParams(window.location.search).get("code");
    console.log(n), m(n);
  }, []);
  const k = () => {
    const t = [];
    return e ? e.length < 8 ? t.push("New password must be at least 8 characters long.") : /[A-Z]/.test(e) ? /[a-z]/.test(e) ? /[0-9]/.test(e) ? /[!@#$%^&*]/.test(e) || t.push("At least one symbol (!@#$%^&*) required.") : t.push("At least one number (0-9) required.") : t.push("At least one lowercase letter (a-z) required.") : t.push("At least one uppercase letter (A-Z) required.") : t.push("Password is required."), h(e && r && e !== r ? "Passwords do not match." : ""), S(t), t.length === 0 && e === r;
  }, d = useMutation({ mutationFn: async (t) => {
    const n = await fetch("https://dev-api-tm.labsquire.com/v3.0/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t) }), w = await n.json();
    if (!n.ok) throw new Error(w.message || `Error ${n.status}: ${n.statusText}`);
    return w;
  }, onError: (t) => {
    console.error("Reset Password Error:", t.message), alert(t.message);
  }, onSuccess: (t) => {
    t.status === 200 && (alert("Password Reset Successful! You can now log in."), window.location.href = "/sign-in-page");
  } }), A = (t) => {
    if (t.preventDefault(), !c) {
      alert("Invalid or missing reset token.");
      return;
    }
    k() && d.mutate({ new_password: e, confirm_new_password: r, reset_password_token: c });
  };
  return jsxs("div", { style: { display: "flex", justifyContent: "center", padding: "20px", position: "relative" }, children: [e.length > 0 && jsxs("div", { style: { position: "absolute", top: "20px", left: "400px", background: "#f8f8f8", padding: "10px", borderRadius: "10px", fontSize: "18px", color: "#555", width: "2000px", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }, children: [jsx("strong", { children: "Password Requirements:" }), " ", jsxs("ul", { style: { paddingLeft: "30px", listStyleType: "none" }, children: [jsxs("li", { children: [jsxs("span", { style: { color: /[A-Z]/.test(e) ? "green" : "red" }, children: [/[A-Z]/.test(e) ? "\u2705" : "\u274C", " "] }), "At least one uppercase letter (A-Z)"] }), jsxs("li", { children: [jsx("span", { style: { color: /[a-z]/.test(e) ? "green" : "red" }, children: /[a-z]/.test(e) ? "\u2705" : "\u274C" }), " ", "At least one lowercase letter (a-z)"] }), jsxs("li", { children: [jsxs("span", { style: { color: /[0-9]/.test(e) ? "green" : "red" }, children: [/[0-9]/.test(e) ? "\u2705" : "\u274C", " "] }), "At least one number (0-9)"] }), jsxs("li", { children: [jsxs("span", { style: { color: /[!@#$%^&*]/.test(e) ? "green" : "red" }, children: [/[!@#$%^&*]/.test(e) ? "\u2705" : "\u274C", " "] }), "At least one symbol (!@#$%^&*)"] }), jsxs("li", { children: [jsx("span", { style: { color: e.length >= 8 ? "green" : "red" }, children: e.length >= 8 ? "\u2705" : "\u274C" }), " ", "At least 8 characters long"] }), jsxs("li", { children: [jsxs("span", { style: { color: e && r && e === r ? "green" : "red" }, children: [e && r && e === r ? "\u2705" : "\u274C", " "] }), "Passwords match"] })] })] }), jsxs("div", { style: { width: "30%", padding: "20px", background: "#fff", borderRadius: "10px", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }, children: [jsx("h2", { style: { textAlign: "left", fontSize: "20px", fontWeight: "bold" }, children: "Reset Password" }), jsxs("form", { onSubmit: A, style: { display: "flex", flexDirection: "column", gap: "15px" }, children: [jsxs("div", { style: { position: "relative", display: "flex", alignItems: "center" }, children: [jsx(LockKeyhole, { style: { position: "absolute", left: "10px", color: "black" } }), jsx("input", { type: a ? "text" : "password", placeholder: "New Password", value: e, onChange: (t) => {
    b(t.target.value);
  }, style: { width: "100%", padding: "10px 10px 10px 40px", border: "1px solid #ccc", borderRadius: "5px" } }), jsx("button", { type: "button", onClick: () => P(!a), style: { position: "absolute", right: "10px", background: "none", border: "none", cursor: "pointer", color: "black" }, children: a ? jsx(Eye, {}) : jsx(EyeOff, {}) })] }), u && jsx("div", { style: { color: "red", fontSize: "14px" }, children: u }), p.length > 0 && p.map((t, n) => jsxs("p", { style: { color: "red", fontSize: "14px" }, children: ["\u274C ", t] }, n)), jsxs("div", { style: { position: "relative", display: "flex", alignItems: "center" }, children: [jsx(LockKeyhole, { style: { position: "absolute", left: "4px", color: "balck", pointerEvents: "none" } }), jsx("input", { type: i ? "text" : "password", placeholder: " Re-Enter Password", value: r, onChange: (t) => y(t.target.value), style: { width: "100%", padding: "10px 10px 10px 40px", border: "1px solid #ccc", borderRadius: "5px" } }), jsx("button", { type: "button", onClick: () => v(!i), style: { marginLeft: "-60px", background: "none", border: "none", cursor: "pointer", color: "black" }, children: i ? jsx(Eye, {}) : jsx(EyeOff, {}) })] }), jsx("p", { children: "1.New password must be at least 8 characters long" }), jsx("button", { type: "submit", style: { width: "100%", background: "#007bff", color: "white", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }, disabled: d.isPending, children: d.isPending ? "Resetting..." : "Recover Account" })] })] })] });
}
const j = z;

export { j as component };
//# sourceMappingURL=reset-password-NE-D3iDd.mjs.map
