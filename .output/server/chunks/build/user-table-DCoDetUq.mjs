import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import x from 'js-cookie';
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { q as q$1 } from './EditUserForm-BVyw8kU9.mjs';
import { useNavigate } from '@tanstack/react-router';

const D = (a) => {
  const c = ["S.N", "First Name", "Last Name", "Email", "Designation", "Mobile Number", "User Type", "To Do", "In Progress", "Overdue", "Completed", "Status"], r = a.map((s, v) => {
    var _a, _b, _c, _d;
    return [(v + 1).toString(), s.fname || "", s.lname || "", s.email || "", s.designation || "", s.phone_number || "", s.user_type || "", ((_a = s.todo_count) == null ? void 0 : _a.toString()) || "0", ((_b = s.in_progress_count) == null ? void 0 : _b.toString()) || "0", ((_c = s.overdue_count) == null ? void 0 : _c.toString()) || "0", ((_d = s.completed_count) == null ? void 0 : _d.toString()) || "0", s.status === "active" ? "Active" : "Inactive"];
  }), o = [c.join(","), ...r.map((s) => s.join(","))].join(`
`), n = new Blob([o], { type: "text/csv;charset=utf-8;" }), i = document.createElement("a"), d = "users.csv";
  i.href = URL.createObjectURL(n), i.download = d, i.click();
}, R = async ({ queryKey: a }) => {
  const [c, r, o, n, i, d, s] = a, v = x.get("access_token");
  let y = `https://dev-api-tm.labsquire.com/v3.0/users/status-count?page=${r}&page_size=${o}&active=${n === "active" ? "true" : "false"}&user_type=${i === "user" ? "user" : "admin"}`;
  d && (y += `&search_string=${d}`), s && (y += `&search_email=${s.toLowercase()}`);
  const g = await fetch(y, { headers: { Authorization: `Bearer ${v}` } });
  if (!g.ok) throw new Error("Failed to fetch users");
  return g.json();
}, q = async (a) => {
  const c = x.get("access_token"), r = await fetch(`https://dev-api-tm.labsquire.com/v3.0/users/export?active=true&search_string=${a}`, { headers: { Authorization: `Bearer ${c}` } }), o = await fetch(`https://dev-api-tm.labsquire.com/v3.0/users/status-count?page=1&page_size=25&search_string=${a}&active=true`, { headers: { Authorization: `Bearer ${c}` } });
  if (!r.ok || !o) throw new Error("failed to fetch users by name");
  const n = await r.json(), i = await o.json();
  return { exportData: n, statusData: i };
}, L = async (a) => {
  const c = x.get("access_token");
  try {
    const r = await fetch(`https://dev-api-tm.labsquire.com/v3.0/users/status-count?page=1&page_size=25&active=true&email=${a}`, { headers: { Authorization: `Bearer ${c}` } });
    if (!r.ok) throw new Error("Failed to fetch users");
    const o = await r.json();
    return console.log("Fetched Users by Email:", o), o;
  } catch (r) {
    return console.error("Error fetching users by email:", r), null;
  }
}, z = async (a, c) => {
  const r = x.get("access_token");
  let o = "https://dev-api-tm.labsquire.com/v3.0/users/status-count?page=1&page_size=25&active=true";
  a && (o += `&search_string=${a}`), c && (o += `&email=${c}`);
  try {
    const n = await fetch(o, { headers: { Authorization: `Bearer ${r}` } });
    if (!n.ok) throw new Error("Failed to fetch the data");
    const i = await n.json();
    return console.log("Fetched users by Name and Email:", i), i;
  } catch (n) {
    return console.error("Error fetching users by name and email:", n), null;
  }
}, M = () => {
  var _a, _b, _c, _d, _e, _f;
  const [a, c] = useState(1), [r, o] = useState(12), [n, i] = useState("active"), [d, s] = useState("user"), [v, y] = useState(""), [g, E] = useState(null), [u, S] = useState(""), [h, k] = useState(""), K = useNavigate(), { data: b, isLoading: $, isError: U, refetch: j } = useQuery({ queryKey: ["users", a, r, n, d, u, h], queryFn: async () => (console.log("fetching users", { page: a, limit: r, statusFilter: n, userType: d, searchName: u, searchEmail: h }), u && h ? await z(u, h) : u ? await q(u) : h ? await L(h) : await R({ queryKey: ["users", a, r, n, d, u, h] })), placeholderData: (e) => e }), f = ((_b = (_a = b == null ? void 0 : b.exportData) == null ? void 0 : _a.data) == null ? void 0 : _b.records) || ((_d = (_c = b == null ? void 0 : b.statusData) == null ? void 0 : _c.data) == null ? void 0 : _d.records) || ((_e = b == null ? void 0 : b.data) == null ? void 0 : _e.records) || [], C = ((_f = b == null ? void 0 : b.pagination_info) == null ? void 0 : _f.total_records) || 230, N = Math.ceil(C / r), w = [{ accessorKey: "id", header: "S.N", cell: ({ row: e }) => (a - 1) * r + e.index + 1 }, { accessorKey: "fname", header: "First Name" }, { accessorKey: "lname", header: "Last Name" }, { accessorKey: "email", header: "Email" }, { accessorKey: "designation", header: "Designation" }, { accessorKey: "phone_number", header: "Mobile Number" }, { accessorKey: "user_type", header: "User Type" }, { accessorKey: "todo_count", header: "To Do" }, { accessorKey: "in_progress_count", header: "In Progress" }, { accessorKey: "overdue_count", header: "Overdue" }, { accessorKey: "completed_count", header: "Completed" }, { accessorKey: "status", header: "Status", cell: ({ row: e }) => {
    const _ = (p) => {
      p.target.value;
    };
    return jsx("span", { style: { color: e.original.active ? "green" : "red", fontWeight: "bold" }, children: jsxs("select", { value: e.original.active ? "active" : "inactive", onChange: _, className: "border p-2", children: [jsx("option", { value: "active", children: "Active" }), jsx("option", { value: "inactive", children: "Inactive" })] }) });
  } }, { accessorKey: "actions", header: "Actions", cell: ({ row: e }) => jsxs("div", { className: "space-x-2", children: [jsx("button", { className: "bg-blue-500 text-white px-2 py-1 rounded", onClick: () => E(e.original), children: "Edit" }), jsx("button", { className: "bg-red-500 text-white px-2 py-1 rounded", children: "Reset Password" })] }) }];
  return useReactTable({ data: f, columns: w, getCoreRowModel: getCoreRowModel() }), jsxs("div", { className: "p-4", children: [jsxs("div", { className: "flex space-x-4 mb-4", children: [jsxs("select", { value: n, onChange: (e) => i(e.target.value), className: "border p-2", children: [jsx("option", { value: "active", children: "Active" }), jsx("option", { value: "inactive", children: "Inactive" })] }), jsxs("select", { value: d, onChange: (e) => s(e.target.value), className: "border p-2", children: [jsx("option", { value: "user", children: "User" }), jsx("option", { value: "admin", children: "Admin" })] }), jsx("input", { type: "text", placeholder: "Search by Name", className: "border p-2", value: u, onChange: (e) => S(e.target.value) }), jsx("input", { type: "text", placeholder: "Search by Email", className: "border p-2", value: h, onChange: (e) => k(e.target.value) }), jsx("button", { className: "bg-green-500 text-white px-4 py-2 rounded", onClick: () => K({ to: "/users/add-user" }), children: "+ Add User" }), jsx("button", { className: "bg-blue-500 text-white px-4 py-2 rounded", onClick: () => D(f), children: "Export" })] }), jsxs("table", { className: "min-w-full border", children: [jsx("thead", { className: "bg-gray-200", children: jsx("tr", { children: w.map((e) => jsx("th", { className: "border p-2", children: e.header }, e.accessorKey)) }) }), jsx("tbody", { children: $ ? jsx("tr", { children: jsx("td", { colSpan: 13, className: "text-center p-4", children: "Loading..." }) }) : U ? jsx("tr", { children: jsx("td", { colSpan: 13, className: "text-center p-4 text-red-500", children: "Error fetching users" }) }) : f.length > 0 ? f.map((e, _) => jsx("tr", { className: "border", children: w.map((p) => jsx("td", { className: "border p-2", children: p.cell ? p.cell({ row: { original: e, index: _ } }) : e[p.accessorKey] || "-" }, p.accessorKey)) }, e.email)) : jsx("tr", { children: jsx("td", { colSpan: 13, className: "text-center p-4", children: "No users found. Users not found pls try again later" }) }) })] }), jsxs("div", { className: "mt-4 flex items-center justify-center space-x-2", children: [jsx("button", { className: `px-3 py-1 rounded ${a === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`, disabled: a === 1, onClick: () => c((e) => Math.max(e - 1, 1)), children: "Previous" }), jsxs("span", { children: ["Page ", a, " of ", N] }), jsx("button", { className: `px-3 py-1 rounded ${a === N ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`, disabled: a === N, onClick: () => c((e) => Math.min(e + 1, N)), children: "Next" })] }), jsx("select", { value: r, onChange: (e) => o(Number(e.target.value)), className: "border p-2", children: [12, 25, 50, 150, 200, 250, 500].map((e) => jsxs("option", { value: e, children: [e, " / Page"] }, e)) }), jsx("tr", { className: "bg-gray-100", children: jsxs("td", { colSpan: w.length, className: "text-right font-bold p-2", children: ["Total Users: ", C] }) }), g && jsx(q$1, { project: g, onClose: () => E(null), onUpdate: j })] });
}, J = M;

export { J as component };
//# sourceMappingURL=user-table-DCoDetUq.mjs.map
