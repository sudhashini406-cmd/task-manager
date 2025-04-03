import { jsxs, jsx } from 'react/jsx-runtime';
import { useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import x from 'js-cookie';
import { Eye, EyeOff } from 'lucide-react';

function R({ onClose: b, onUserAdded: f }) {
  const u = useNavigate(), { register: l, handleSubmit: N, watch: x$1, formState: { errors: n } } = useForm(), [c, y] = useState(false), [m, p] = useState(false), a = x$1("password", ""), [v, h] = useState(false), [w, g] = useState(false), [A, S] = useState(""), q = /[A-Z]/.test(a), k = /[a-z]/.test(a), E = /[0-9]/.test(a), P = /[!@#$%^&*]/.test(a), U = a.length >= 8, z = q && k && E && P && U;
  useEffect(() => {
    z && h(false);
  }, [a]);
  const C = useMutation({ mutationFn: async (s) => {
    p(true);
    const L = `Bearer ${x.get("access_token")}`, o = await fetch("https://dev-api-tm.labsquire.com/v3.0/users/add", { method: "POST", headers: { "Content-Type": "application/json", Authorization: L }, body: JSON.stringify(s) });
    if (!o.ok) {
      let i = "Something went wrong!";
      throw o.status === 401 && (i = "Unauthorized: Invalid or missing authentication token."), o.status === 404 && (i = "API endpoint not found (404). Please check the URL."), o.status === 422 && (i = (await o.json()).message || "Invalid input data (422). Please check your form."), o.status === 409 && (i = (await o.json()).message || "Conflict (409): The data already exists."), new Error(i);
    }
    return await o.json();
  }, onSuccess: async (s) => {
    const r = { id: s.id, firstName: s.fname, lastName: s.lname, email: s.email, designation: s.designation, mobile: s.phone_number, type: s.user_type };
    f(r), S("User added successfully!"), g(true), setTimeout(() => {
      g(false);
    }, 4e3), b();
  }, onSettled: () => p(false) });
  return jsxs("div", { children: [w && jsx("div", { className: "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded", children: A }), jsxs("div", { className: "fixed inset-0 bg-orange bg-opacity-10 backdrop-blur-sm z-50 flex", children: [jsx("div", { className: "flex-1" }), jsxs("div", { className: "bg-white w-96 h-full p-6 rounded-l-lg shadow-lg relative fixed right-0 top-0", children: [jsx("h2", { className: "text-lg font-bold mb-4", children: "Add User" }), jsx("button", { className: "absolute top-2 right-2 text-gray-500 hover:text-gray-700", onClick: () => u({ to: "/users/user-table" }), children: "\u2716" }), jsxs("form", { onSubmit: N((s) => C.mutate(s)), className: "space-y-4", children: [jsxs("div", { children: [jsxs("label", { className: "font-bold", children: ["First Name", jsx("span", { className: "text-red-500", children: "*" })] }), jsx("input", { type: "text", placeholder: "Enter First Name", ...l("fname", { required: "First Name is required", pattern: { value: /^[A-Za-z]+$/, message: "First name contains only letters" }, minLength: { value: 3, message: "At least 3 characters required" } }), className: "w-full p-2 border rounded", onInput: (s) => {
    const r = s.target;
    r.value = r.value.replace(/[^a-zA-Z0-9]/g, "");
  } }), n.fname && jsx("p", { className: "text-red-500 text-sm", children: n.fname.message })] }), jsxs("div", { children: [jsxs("label", { className: "font-bold", children: ["Last Name", jsx("span", { className: "text-red-500", children: "*" })] }), jsx("input", { type: "text", placeholder: "Enter Last Name", ...l("lname", { required: "Last Name is required", pattern: { value: /^[A-Za-z]+$/, message: "last name must contain only letters" } }), className: "w-full p-2 border rounded", onInput: (s) => {
    const r = s.target;
    r.value = r.value.replace(/[^a-zA-Z0-9]/g, "");
  } }), n.lname && jsx("p", { className: "text-red-500 text-sm", children: n.lname.message })] }), jsxs("div", { children: [jsx("label", { className: "font-bold", children: "Mobile Number" }), jsxs("div", { className: "flex", children: [jsxs("select", { ...l("country_code", { required: "Country code is required" }), className: "p-2  border rounded-l bg-gray-200", children: [jsx("option", { value: "+91", children: "+91 (India)" }), jsx("option", { value: "+1", children: "+1 (USA)" }), jsx("option", { value: "+44", children: "+44 (UK)" }), jsx("option", { value: "+61", children: "+61 (Australia)" }), jsx("option", { value: "+81", children: "+81 (Japan)" })] }), jsx("input", { type: "text", placeholder: "Enter Phone Number", ...l("phone_number", { required: "Mobile number is required", pattern: { value: /^\d{10}$/, message: "Enter a valid 10-digit mobile number" } }), maxLength: 10, className: "w-full p-2 border rounded" }), n.phone_number && jsx("p", { className: "text-red-500 text-sm", children: n.phone_number.message })] })] }), jsxs("div", { children: [jsxs("label", { className: "font-bold", children: ["Email", jsx("span", { className: "text-red-500", children: "*" })] }), jsx("input", { type: "email", placeholder: "Enter Email", ...l("email", { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/i, message: "Invalid email format" } }), className: "w-full p-2 border rounded" }), n.email && jsx("p", { className: "text-red-500 text-sm", children: n.email.message })] }), jsxs("div", { className: "relative", children: [jsxs("label", { className: "font-bold", children: ["Password", jsx("span", { className: "text-red-500", children: "*" })] }), jsx("input", { type: c ? "text" : "password", placeholder: "Enter Password", ...l("password", { required: "Password is required", minLength: { value: 8, message: "Must be at least 8 characters" } }), className: "w-full p-2 border rounded", onFocus: () => h(true) }), jsx("button", { onClick: () => y(!c), className: "absolute right-3 top-8 text-gray-500", children: c ? jsx(Eye, {}) : jsx(EyeOff, {}) }), v && jsxs("div", { style: { position: "absolute", top: "50px", left: "0px", background: "#f8f8f8", padding: "10px", borderRadius: "10px", fontSize: "14px", color: "#555", width: "300px", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }, children: [jsx("strong", { children: "Password Requirements:" }), jsxs("ul", { className: "list-none pl-4", children: [jsxs("li", { style: { color: /[A-Z]/.test(a) ? "green" : "red" }, children: [/[A-Z]/.test(a) ? "\u2705" : "\u274C", " At least one uppercase letter (A-Z)"] }), jsxs("li", { style: { color: /[a-z]/.test(a) ? "green" : "red" }, children: [/[a-z]/.test(a) ? "\u2705" : "\u274C", " At least one lowercase letter (a-z)"] }), jsxs("li", { style: { color: /[0-9]/.test(a) ? "green" : "red" }, children: [/[0-9]/.test(a) ? "\u2705" : "\u274C", " At least one number (0-9)"] }), jsxs("li", { style: { color: /[!@#$%^&*]/.test(a) ? "green" : "red" }, children: [/[!@#$%^&*]/.test(a) ? "\u2705" : "\u274C", " At least one symbol (!@#$%^&*)"] }), jsxs("li", { style: { color: a.length >= 8 ? "green" : "red" }, children: [a.length >= 8 ? "\u2705" : "\u274C", " At least 8 characters long"] })] })] }), jsx("label", { className: "font-bold", children: "Designation" }), jsx("input", { type: "text", placeholder: "Enter Designation", ...l("designation", {}), className: "w-full p-2 border rounded", onInput: (s) => {
    const r = s.target;
    r.value = r.value.replace(/[^a-zA-Z0-9]/g, "");
  } })] }), jsxs("div", { children: [jsxs("label", { className: "font-bold", children: ["User Type", jsx("span", { className: "text-red-500", children: "*" })] }), jsxs("select", { ...l("user_type", { required: "User Type is required" }), className: "w-full p-2 border rounded", children: [jsx("option", { value: "", children: "Select" }), jsx("option", { value: "user", children: "User" }), jsx("option", { value: "admin", children: "Admin" })] }), n.user_type && jsx("p", { className: "text-red-500 text-sm", children: n.user_type.message })] }), jsxs("div", { className: "flex justify-between mt-4", children: [jsx("button", { type: "button", onClick: () => u({ to: "/users/user-table" }), className: "bg-gray-300 px-4 py-2 rounded", children: "Cancel" }), jsx("button", { type: "submit", className: "bg-green-500 text-white px-4 py-2 rounded", disabled: m, children: m ? "Adding..." : "Add User" })] })] })] })] })] });
}
const Q = R;

export { Q as component };
//# sourceMappingURL=add-user-DNsERvEw.mjs.map
