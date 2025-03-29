import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import N from 'js-cookie';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

const q = {}, j = q + "/users/update-password", R = (a) => ({ length: a.length >= 8, uppercase: /[A-Z]/.test(a), lowercase: /[a-z]/.test(a), number: /[0-9]/.test(a), specialChar: /[!@#$%^&*]/.test(a) }), U = async (a) => {
  const c = N.get("access_token");
  if (!c) throw new Error("401: No token found. Please log in again.");
  const i = await fetch(j, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${c}` }, body: JSON.stringify(a) }), t = await i.json();
  if (i.status === 401) throw new Error("401: Provided current password is wrong.");
  if (i.status === 422) throw new Error(t.message || "422: Invalid input. Please check your details.");
  if (!i.ok) throw new Error(t.message || "Something went wrong.");
  return t;
}, z = () => {
  const a = useNavigate(), [c, i] = useState(""), [t, b] = useState(""), [l, P] = useState(""), [m, p] = useState({ current: false, new: false, confirm: false }), [u, w] = useState({ current: "", newPass: "", confirm: "" }), [n, N] = useState({ length: false, uppercase: false, lowercase: false, number: false, specialChar: false }), [x, y] = useState(false), h = useMutation({ mutationFn: U, onSuccess: () => {
    alert(" Password Changed Successfully!"), i(""), b(""), P(""), w({ current: "", newPass: "", confirm: "" }), y(false);
  }, onError: (r) => {
    alert(r.message);
  } }), C = (r) => {
    r.preventDefault();
    let o = { current: "", newPass: "", confirm: "" };
    c || (o.current = "Current password is required."), t || (o.newPass = "New password is required."), c && t && !l ? o.confirm = "Confirm password is required." : t !== l && (o.confirm = "\u274C Passwords do not match."), w(o), !o.current && !o.newPass && !o.confirm && h.mutate({ current_password: c, new_password: t, confirm_new_password: l });
  }, v = (r) => {
    b(r.target.value), w((k) => ({ ...k, newPass: "" }));
    const o = R(r.target.value);
    N(o), y(true);
  };
  return jsxs("div", { className: "max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg", children: [jsx("h2", { className: "text-2xl font-bold mb-4", children: "Update Password" }), jsxs("form", { onSubmit: C, className: "space-y-4", children: [jsxs("div", { className: "relative", children: [jsxs("label", { className: "block font-medium", children: ["Current Password ", jsx("span", { style: { color: "red" }, children: "*" })] }), jsx("input", { type: m.current ? "text" : "password", value: c, placeholder: "Current Password", onChange: (r) => i(r.target.value), className: "w-full p-2 border border-gray-300 rounded" }), jsx("button", { type: "button", onClick: () => p((r) => ({ ...r, current: !r.current })), className: "absolute right-3 top-10", children: m.current ? jsx(Eye, {}) : jsx(EyeOff, {}) }), u.current && jsx("p", { className: "text-red-500 text-sm", children: u.current })] }), jsxs("div", { className: "relative", children: [jsxs("label", { className: "block font-medium", children: ["New Password ", jsx("span", { style: { color: "red" }, children: "*" })] }), jsx("input", { type: m.new ? "text" : "password", value: t, placeholder: "New Password", onChange: v, className: "w-full p-2 border border-gray-300 rounded" }), jsx("button", { type: "button", onClick: () => p((r) => ({ ...r, new: !r.new })), className: "absolute right-3 top-10", children: m.new ? jsx(Eye, {}) : jsx(EyeOff, {}) }), u.newPass && jsx("p", { className: "text-red-500 text-sm", children: u.newPass }), x && jsxs("div", { className: "border p-3 mt-2 rounded bg-gray-100", children: [jsxs("p", { className: n.uppercase ? "text-green-500" : "text-gray-500", children: [n.uppercase ? "\u2705" : "\u274C", " At least one uppercase letter (A-Z)"] }), jsxs("p", { className: n.lowercase ? "text-green-500" : "text-gray-500", children: [n.lowercase ? "\u2705" : "\u274C", " At least one lowercase letter (a-z)"] }), jsxs("p", { className: n.number ? "text-green-500" : "text-gray-500", children: [n.number ? "\u2705" : "\u274C", " At least one number (0-9)"] }), jsxs("p", { className: n.specialChar ? "text-green-500" : "text-gray-500", children: [n.specialChar ? "\u2705" : "\u274C", " At least one symbol (!@#$%^&*)"] }), jsxs("p", { className: n.length ? "text-green-500" : "text-gray-500", children: [n.length ? "\u2705" : "\u274C", " At least 8 characters long"] }), jsxs("li", { children: [jsxs("span", { style: { color: t && l && t === l ? "green" : "red" }, children: [t && l && t === l ? "\u2705" : "\u274C", " "] }), "Passwords match"] })] })] }), jsxs("div", { className: "relative", children: [jsxs("label", { className: "block font-medium", children: ["Confirm New Password ", jsx("span", { style: { color: "red" }, children: "*" })] }), jsx("input", { type: m.confirm ? "text" : "password", value: l, placeholder: "Confrim Password", onChange: (r) => P(r.target.value), className: "w-full p-2 border border-gray-300 rounded" }), jsx("button", { type: "button", onClick: () => p((r) => ({ ...r, confirm: !r.confirm })), className: "absolute right-3 top-10", children: m.confirm ? jsx(Eye, {}) : jsx(EyeOff, {}) }), u.confirm && jsx("p", { className: "text-red-500 text-sm", children: u.confirm })] }), jsx("button", { type: "button", className: "px-4 py-2 bg-gray-500 text-white rounded ml-2", onClick: () => a({ to: "/users/user-table" }), children: "Cancel" }), " ", jsx("button", { type: "submit", className: "px-4 py-2 bg-blue-500 text-white rounded", disabled: h.isPending, children: h.isPending ? "Updating..." : "Update" })] }), jsx("div", { children: jsxs("button", { onClick: () => a({ to: "/projects/project-table" }), className: `flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 \r
             text-black font-semibold rounded-md shadow-md transition duration-200`, children: [jsx(ArrowLeft, { size: 18 }), " Go Back"] }) })] });
}, Z = z;

export { Z as component };
//# sourceMappingURL=update-password-CT9TQj3Z.mjs.map
