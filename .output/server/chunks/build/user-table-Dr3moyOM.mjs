import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import N from 'js-cookie';
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { q } from './EditUserForm-BVyw8kU9.mjs';
import { a } from './ExportCsv-Cxm1M38I.mjs';
import { useNavigate } from '@tanstack/react-router';

const z = async ({ queryKey: a }) => {
  const [c, r, s, o, i, h, g] = a, _ = N.get("access_token");
  let y = `https://dev-api-tm.labsquire.com/v3.0/users/status-count?page=${r}&page_size=${s}&active=${o === "active" ? "true" : "false"}&user_type=${i === "user" ? "user" : "admin"}`;
  h && (y += `&search_string=${h}`), g && (y += `&search_email=${g.toLowercase()}`);
  const m = await fetch(y, { headers: { Authorization: `Bearer ${_}` } });
  if (!m.ok) throw new Error("Failed to fetch users");
  return m.json();
}, D = async (a) => {
  const c = N.get("access_token"), r = await fetch(`https://dev-api-tm.labsquire.com/v3.0/users/export?active=true&search_string=${a}`, { headers: { Authorization: `Bearer ${c}` } }), s = await fetch(`https://dev-api-tm.labsquire.com/v3.0/users/status-count?page=1&page_size=25&search_string=${a}&active=true`, { headers: { Authorization: `Bearer ${c}` } });
  if (!r.ok || !s) throw new Error("failed to fetch users by name");
  const o = await r.json(), i = await s.json();
  return { exportData: o, statusData: i };
}, R = async (a) => {
  const c = N.get("access_token");
  try {
    const r = await fetch(`https://dev-api-tm.labsquire.com/v3.0/users/status-count?page=1&page_size=25&active=true&email=${a}`, { headers: { Authorization: `Bearer ${c}` } });
    if (!r.ok) throw new Error("Failed to fetch users");
    const s = await r.json();
    return console.log("Fetched Users by Email:", s), s;
  } catch (r) {
    return console.error("Error fetching users by email:", r), null;
  }
}, M = async (a, c) => {
  const r = N.get("access_token");
  let s = "https://dev-api-tm.labsquire.com/v3.0/users/status-count?page=1&page_size=25&active=true";
  a && (s += `&search_string=${a}`), c && (s += `&email=${c}`);
  try {
    const o = await fetch(s, { headers: { Authorization: `Bearer ${r}` } });
    if (!o.ok) throw new Error("Failed to fetch the data");
    const i = await o.json();
    return console.log("Fetched users by Name and Email:", i), i;
  } catch (o) {
    return console.error("Error fetching users by name and email:", o), null;
  }
}, L = () => {
  var _a, _b, _c, _d, _e, _f;
  const [a$1, c] = useState(1), [r, s] = useState(12), [o, i] = useState("active"), [h, g] = useState("user"), [_, y] = useState(""), [m, E] = useState(null), [l, C] = useState(""), [d, k] = useState(""), K = useNavigate(), { data: v, isLoading: $, isError: S, refetch: U } = useQuery({ queryKey: ["users", a$1, r, o, h, l, d], queryFn: async () => (console.log("fetching users", { page: a$1, limit: r, statusFilter: o, userType: h, searchName: l, searchEmail: d }), l && d ? await M(l, d) : l ? await D(l) : d ? await R(d) : await z({ queryKey: ["users", a$1, r, o, h, l, d] })), placeholderData: (e) => e }), b = ((_b = (_a = v == null ? void 0 : v.exportData) == null ? void 0 : _a.data) == null ? void 0 : _b.records) || ((_d = (_c = v == null ? void 0 : v.statusData) == null ? void 0 : _c.data) == null ? void 0 : _d.records) || ((_e = v == null ? void 0 : v.data) == null ? void 0 : _e.records) || [], j = ((_f = v == null ? void 0 : v.pagination_info) == null ? void 0 : _f.total_records) || 230, f = Math.ceil(j / r), x = [{ accessorKey: "id", header: "S.N", cell: ({ row: e }) => (a$1 - 1) * r + e.index + 1 }, { accessorKey: "fname", header: "First Name" }, { accessorKey: "lname", header: "Last Name" }, { accessorKey: "email", header: "Email" }, { accessorKey: "designation", header: "Designation" }, { accessorKey: "phone_number", header: "Mobile Number" }, { accessorKey: "user_type", header: "User Type" }, { accessorKey: "todo_count", header: "To Do" }, { accessorKey: "in_progress_count", header: "In Progress" }, { accessorKey: "overdue_count", header: "Overdue" }, { accessorKey: "completed_count", header: "Completed" }, { accessorKey: "status", header: "Status", cell: ({ row: e }) => {
    const w = (p) => {
      p.target.value;
    };
    return jsx("span", { style: { color: e.original.active ? "green" : "red", fontWeight: "bold" }, children: jsxs("select", { value: e.original.active ? "active" : "inactive", onChange: w, className: "border p-2", children: [jsx("option", { value: "active", children: "Active" }), jsx("option", { value: "inactive", children: "Inactive" })] }) });
  } }, { accessorKey: "actions", header: "Actions", cell: ({ row: e }) => jsxs("div", { className: "space-x-2", children: [jsx("button", { className: "bg-blue-500 text-white px-2 py-1 rounded", onClick: () => E(e.original), children: "Edit" }), jsx("button", { className: "bg-red-500 text-white px-2 py-1 rounded", children: "Reset Password" })] }) }];
  return useReactTable({ data: b, columns: x, getCoreRowModel: getCoreRowModel() }), jsxs("div", { className: "p-4", children: [jsxs("div", { className: "flex space-x-4 mb-4", children: [jsxs("select", { value: o, onChange: (e) => i(e.target.value), className: "border p-2", children: [jsx("option", { value: "active", children: "Active" }), jsx("option", { value: "inactive", children: "Inactive" })] }), jsxs("select", { value: h, onChange: (e) => g(e.target.value), className: "border p-2", children: [jsx("option", { value: "user", children: "User" }), jsx("option", { value: "admin", children: "Admin" })] }), jsx("input", { type: "text", placeholder: "Search by Name", className: "border p-2", value: l, onChange: (e) => C(e.target.value) }), jsx("input", { type: "text", placeholder: "Search by Email", className: "border p-2", value: d, onChange: (e) => k(e.target.value) }), jsx("button", { className: "bg-green-500 text-white px-4 py-2 rounded", onClick: () => K({ to: "/users/add-user" }), children: "+ Add User" }), jsx("button", { className: "bg-blue-500 text-white px-4 py-2 rounded", onClick: () => a(b), children: "Export" }), jsx("select", { value: r, onChange: (e) => s(Number(e.target.value)), className: "border p-2", children: [12, 25, 50, 150, 200, 250].map((e) => jsxs("option", { value: e, children: [e, " / Page"] }, e)) })] }), jsxs("table", { className: "min-w-full border", children: [jsx("thead", { className: "bg-gray-200", children: jsx("tr", { children: x.map((e) => jsx("th", { className: "border p-2", children: e.header }, e.accessorKey)) }) }), jsx("tbody", { children: $ ? jsx("tr", { children: jsx("td", { colSpan: 13, className: "text-center p-4", children: "Loading..." }) }) : S ? jsx("tr", { children: jsx("td", { colSpan: 13, className: "text-center p-4 text-red-500", children: "Error fetching users" }) }) : b.length > 0 ? b.map((e, w) => jsx("tr", { className: "border", children: x.map((p) => jsx("td", { className: "border p-2", children: p.cell ? p.cell({ row: { original: e, index: w } }) : e[p.accessorKey] || "-" }, p.accessorKey)) }, e.email)) : jsx("tr", { children: jsx("td", { colSpan: 13, className: "text-center p-4", children: "No users found. Users not found pls try again later" }) }) })] }), jsxs("div", { className: "mt-4 flex items-center justify-center space-x-2", children: [jsx("button", { className: `px-3 py-1 rounded ${a$1 === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`, disabled: a$1 === 1, onClick: () => c((e) => Math.max(e - 1, 1)), children: "Previous" }), jsxs("span", { children: ["Page ", a$1, " of ", f] }), jsx("button", { className: `px-3 py-1 rounded ${a$1 === f ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`, disabled: a$1 === f, onClick: () => c((e) => Math.min(e + 1, f)), children: "Next" })] }), m && jsx(q, { project: m, onClose: () => E(null), onUpdate: U })] });
}, X = L;

export { X as component };
//# sourceMappingURL=user-table-Dr3moyOM.mjs.map
