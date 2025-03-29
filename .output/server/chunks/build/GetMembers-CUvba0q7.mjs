import { jsx, jsxs } from 'react/jsx-runtime';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { useState, useMemo, useCallback } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import N from 'js-cookie';

const $ = async () => {
  const e = N.get("access_token");
  if (!e) throw new Error("Authentication token not found");
  const t = await fetch("https://dev-api-tm.labsquire.com/v3.0/users/all?include_admins=true", { method: "GET", headers: { Authorization: `Bearer ${e}`, "Content-Type": "application/json" } });
  if (!t.ok) throw new Error("Failed to fetch users");
  return (await t.json()).data;
}, _ = ({ onConfirm: e }) => {
  const { data: t, isLoading: n, error: l } = useQuery({ queryKey: ["allUsers"], queryFn: $ }), [i, p] = useState([]), [d, h] = useState(""), f = useCallback((a) => {
    p((m) => m.includes(a) ? m.filter((y) => y !== a) : [...m, a]);
  }, []), b = useMemo(() => t ? t.map((a) => ({ id: a.id, name: `${a.fname} ${a.lname}` })).filter((a) => a.name.toLowerCase().includes(d.toLowerCase())) : [], [t, d]);
  return n ? jsx("p", { className: "text-center text-gray-600", children: "Loading..." }) : l ? jsxs("p", { className: "text-center text-red-500", children: ["Error: ", l.message] }) : jsxs("div", { className: "p-6 bg-white shadow-md rounded-lg w-96", children: [jsx("h3", { className: "text-xl font-semibold text-center mb-4", children: "Select Members" }), jsx("input", { type: "text", placeholder: "Search by name...", className: "w-full p-2 border border-gray-300 rounded-md mb-4", value: d, onChange: (a) => h(a.target.value) }), jsx("div", { className: "max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2", children: b.length > 0 ? b.map((a) => jsxs("label", { className: "flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer", children: [jsx("input", { type: "checkbox", className: "w-4 h-4", checked: i.includes(a.id), onChange: () => f(a.id) }), jsx("span", { className: "text-gray-700", children: a.name })] }, a.id)) : jsx("p", { className: "text-gray-500 text-center", children: "No users found" }) }), jsxs("div", { className: "mt-4 flex justify-between", children: [jsx("button", { onClick: () => p([]), className: "px-4 py-2 bg-gray-400 text-white rounded-md", children: "Clear" }), jsx("button", { onClick: () => e(i), className: "px-4 py-2 bg-blue-600 text-white rounded-md", children: "Confirm" })] })] });
}, w = N.get("access_token"), K = async (e) => {
  if (!e) throw new Error("Project ID is missing");
  const t = await fetch(`https://dev-api-tm.labsquire.com/v3.0/projects/${e}/members`, { method: "GET", headers: { Authorization: `Bearer ${w}`, "Content-Type": "application/json" } });
  if (!t.ok) throw new Error("Failed to fetch project members");
  return (await t.json()).data.members;
}, A = async ({ projectId: e, memberId: t }) => {
  if (!(await fetch(`https://dev-api-tm.labsquire.com/v3.0/projects/${e}/members`, { method: "DELETE", headers: { Authorization: `Bearer ${w}`, "Content-Type": "application/json" }, body: JSON.stringify({ project_member_id: t }) })).ok) throw new Error("Failed to delete member");
  return t;
}, F = async ({ projectId: e, members: t }) => {
  const n = await fetch(`https://dev-api-tm.labsquire.com/v3.0/projects/${e}/members`, { method: "POST", headers: { Authorization: `Bearer ${w}`, "Content-Type": "application/json" }, body: JSON.stringify({ project_members: t, group_id: [] }) });
  if (!n.ok) throw new Error("Failed to add members");
  return n.json();
}, O = () => {
  const { projectId: e } = useParams({ strict: false }), t = useQueryClient(), [n, l] = useState(false), { data: i, isLoading: p, error: d } = useQuery({ queryKey: ["projectMembers", e], queryFn: () => K(e != null ? e : ""), enabled: !!e }), h = useMutation({ mutationFn: A, onMutate: async ({ memberId: o }) => {
    if (!e) {
      console.error("projectId is undefined");
      return;
    }
    await t.cancelQueries({ queryKey: ["projectMembers", e] });
    const s = t.getQueryData(["projectMembers", e]);
    return t.setQueryData(["projectMembers", e], (u) => u ? u.filter((C) => C.id !== o) : []), { previousMembers: s };
  }, onError: (o, s, u) => {
    (u == null ? void 0 : u.previousMembers) && t.setQueryData(["projectMembers", e], u.previousMembers);
  }, onSettled: () => {
    t.invalidateQueries({ queryKey: ["projectMembers", e] });
  } }), f = useMutation({ mutationFn: F, onSuccess: () => {
    t.invalidateQueries({ queryKey: ["projectMembers", e] });
  } }), b = (o) => {
    l(false), o.length > 0 && f.mutate({ projectId: e != null ? e : "", members: o.map((s) => ({ user_id: s, role: "MEMBER" })) });
  }, a = useMemo(() => [{ header: "Sl.no", accessorKey: "sno" }, { header: "Members", accessorKey: "name", cell: ({ row: o }) => jsx("div", { className: "flex items-center gap-3", children: jsx("span", { className: "text-gray-700", children: o.original.name }) }) }, { header: "Role", accessorKey: "role" }, { header: "Action", accessorKey: "action", cell: ({ row: o }) => jsx("button", { className: "bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition", onClick: () => h.mutate({ projectId: e != null ? e : "", memberId: o.original.id }), children: "Remove" }) }], [h, e]), m = useMemo(() => i ? i.map((o, s) => ({ id: o.id, sno: s + 1, name: `${o.fname} ${o.lname}`, role: o.role })) : [], [i]), y = useReactTable({ data: m, columns: a, getCoreRowModel: getCoreRowModel() });
  return p ? jsx("p", { className: "text-center text-gray-600", children: "Loading..." }) : d ? jsxs("p", { className: "text-center text-red-500", children: ["Error: ", d.message] }) : jsxs("div", { className: "p-6", children: [jsx("h3", { className: "text-xl font-semibold text-left mb-4", children: "Project Members" }), jsx("button", { className: "mb-4 px-4 py-2 bg-green-500 text-white rounded-md", onClick: () => l(!n), children: "AddMembers" }), n && jsx(_, { onConfirm: b }), jsx("div", { className: "overflow-x-auto", children: jsxs("table", { className: "w-full border-collapse border border-gray-300", children: [jsx("thead", { className: "bg-gray-100", children: y.getHeaderGroups().map((o) => jsx("tr", { className: "border-b border-gray-300", children: o.headers.map((s) => jsx("th", { className: "px-4 py-2 text-left border border-gray-300", children: flexRender(s.column.columnDef.header, s.getContext()) }, s.id)) }, o.id)) }), jsx("tbody", { children: y.getRowModel().rows.map((o) => jsx("tr", { className: "hover:bg-gray-50 transition border-b border-gray-300", children: o.getVisibleCells().map((s) => jsx("td", { className: "px-4 py-2 border border-gray-300", children: flexRender(s.column.columnDef.cell, s.getContext()) }, s.id)) }, o.id)) })] }) })] });
};

export { O, _ };
//# sourceMappingURL=GetMembers-CUvba0q7.mjs.map
