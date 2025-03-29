import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import N from 'js-cookie';

const p = N.get("access_token"), q = ({ project: s, onClose: u, onUpdate: h }) => {
  const [r, m] = useState({ fname: "", lname: "", email: "", phone_number: "", designation: "", user_type: "user" });
  useEffect(() => {
    s && m({ fname: s.fname || "", lname: s.lname || "", email: s.email || "", phone_number: s.phone_number || "", designation: s.designation || "", user_type: s.user_type || "user" });
  }, [s]);
  const b = useQueryClient(), d = useMutation({ mutationFn: async (t) => {
    const n = await fetch(`https://dev-api-tm.labsquire.com/v3.0/users/${s.id}`, { method: "PATCH", headers: { Authorization: `Bearer ${p}`, "Content-Type": "application/json" }, body: JSON.stringify(t) });
    if (!n.ok) {
      const o = await n.json();
      if (o.message.includes("email already exists")) return;
      throw new Error(o.message || "Failed to update user");
    }
    return n.json();
  }, onSuccess: async (t) => {
    console.log("User updated successfully:", t), await b.invalidateQueries({ queryKey: ["user"] });
    try {
      const n = await fetch("https://dev-api-tm.labsquire.com/v3.0/users/status-count?page=1&page_size=25&active=true", { method: "GET", headers: { Authorization: `Bearer ${p}`, "Content-Type": "application/json" } });
      if (!n.ok) throw new Error("Failed to fetch status count");
      const o = await n.json();
      console.log("Updated status count:", o);
    } catch (n) {
      console.error("Error fetching user status count:", n);
    }
    h(), u();
  }, onError: (t) => {
    console.error("Error updating user:", t), alert(t.message || "Failed to update user. Please try again.");
  } }), [l, v] = useState({}), i = (t) => {
    const { name: n, value: o } = t.target;
    m((f) => ({ ...f, [n]: o }));
  };
  return jsxs("div", { className: "fixed inset-0 bg-orange bg-opacity-10 backdrop-blur-sm z-50 flex", children: [jsx("div", { className: "flex-1" }), jsxs("div", { className: "bg-white w-96 h-full p-6 rounded-l-lg shadow-lg relative fixed right-0 top-0", children: [jsx("h2", { className: "text-lg font-bold mb-4", children: "Edit User" }), jsxs("form", { onSubmit: (t) => {
    t.preventDefault(), d.mutate(r);
  }, className: "space-y-4", children: [jsxs("div", { children: [jsxs("label", { className: "block font-semibold", children: ["First Name ", jsx("span", { className: "text-red-500", children: "*" })] }), jsx("input", { type: "text", name: "fname", value: r.fname, onChange: i, className: "border px-2 py-1 w-full rounded", required: true }), l.fname && jsx("p", { className: "text-red-500 text-sm", children: l.fname })] }), jsxs("div", { children: [jsxs("label", { className: "block font-semibold", children: ["Last Name ", jsx("span", { className: "text-red-500", children: "*" })] }), jsx("input", { type: "text", name: "lname", value: r.lname, onChange: i, className: "border px-2 py-1 w-full rounded", required: true }), l.lname && jsx("p", { className: "text-red-500 text-sm", children: l.lname })] }), jsxs("div", { children: [jsx("label", { className: "block font-semibold", children: "Mobile Number" }), jsx("input", { type: "text", name: "phone_number", value: r.phone_number, onChange: i, className: "border px-2 py-1 w-full rounded" })] }), " ", jsxs("div", { children: [jsxs("label", { className: "block font-semibold", children: ["Email ", jsx("span", { className: "text-red-500", children: "*" })] }), jsx("input", { type: "email", name: "email", value: r.email, onChange: i, className: "border px-2 py-1 w-full rounded", required: true }), l.email && jsx("p", { className: "text-red-500 text-sm", children: l.email })] }), jsxs("div", { children: [jsx("label", { className: "block font-semibold", children: "Designation" }), jsx("input", { type: "text", name: "designation", value: r.designation, onChange: i, className: "border px-2 py-1 w-full rounded" })] }), jsxs("div", { children: [jsxs("label", { className: "block font-semibold", children: ["User Type ", jsx("span", { className: "text-red-500", children: "*" })] }), jsxs("select", { name: "user_type", value: r.user_type, onChange: i, className: "border px-2 py-1 w-full rounded", required: true, children: [jsx("option", { value: "user", children: "User" }), jsx("option", { value: "admin", children: "Admin" })] })] }), jsxs("div", { className: "flex justify-end space-x-2 mt-4", children: [jsx("button", { type: "button", onClick: u, className: "bg-gray-500 text-white px-4 py-2 rounded", children: "Cancel" }), jsx("button", { type: "submit", className: "bg-blue-500 text-white px-4 py-2 rounded", disabled: d.isPending, children: d.isPending ? "Saving..." : "Save Changes" })] })] })] })] });
};

export { q };
//# sourceMappingURL=EditUserForm-BVyw8kU9.mjs.map
