import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import N from 'js-cookie';
import { a } from './ExportCsv-Cxm1M38I.mjs';
import { useNavigate } from '@tanstack/react-router';

const k = ({ project: o, onClose: i, onUpdate: s }) => {
  const [r, l] = useState({ id: 0, title: "", code: "", description: "", timezone: "" }), [p, n] = useState(false);
  useEffect(() => {
    o && l(o);
  }, [o]);
  const u = (d) => {
    l({ ...r, [d.target.name]: d.target.value });
  }, m = async () => {
    const d = N.get("access_token");
    if (!(!d || !r.id)) try {
      (await (await fetch(`https://dev-api-tm.labsquire.com/v3.0/projects/${r.id}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${d}` }, body: JSON.stringify({ title: r.title, code: r.code, description: r.description, timezone: r.timezone }) })).json()).success && (n(true), s(), setTimeout(() => {
        n(false), i();
      }, 1e3));
    } catch (h) {
      console.error("Update error:", h);
    }
  };
  return o ? jsxs("div", { className: "fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50", children: [jsxs("div", { className: "bg-white p-6 rounded-lg shadow-lg w-96", children: [jsx("h2", { className: "text-xl font-bold mb-4", children: "Edit Project" }), jsxs("label", { className: "block font-semibold", children: ["Title", jsx("span", { className: "text-red-500", children: "*" })] }), jsx("input", { type: "text", name: "title", value: r.title, onChange: u, className: "w-full p-2 border rounded mt-1" }), jsxs("label", { className: "block font-semibold mt-2", children: ["Project Code", jsx("span", { className: "text-red-500", children: "*" })] }), jsx("input", { type: "text", name: "code", value: r.code, onChange: u, className: "w-full p-2 border rounded mt-1" }), jsx("label", { className: "block font-semibold mt-2", children: "Project Description" }), jsx("textarea", { name: "description", value: r.description, onChange: u, className: "w-full p-2 border rounded mt-1" }), jsxs("div", { className: "flex justify-between mt-4", children: [jsx("button", { onClick: m, className: "bg-blue-500 text-white px-4 py-2 rounded", children: "Save" }), jsx("button", { onClick: i, className: "bg-gray-400 text-white px-4 py-2 rounded", children: "Cancel" })] })] }), p && jsx("div", { className: "fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-500", children: "Project updated successfully!" })] }) : null;
}, S = [12, 25, 50, 100, 250, 500], T = async ({ page: o, pageSize: i, search: s = "", status: r = "", orderBy: l = "created_at:desc" }) => {
  var _a, _b, _c;
  const p = N.get("access_token");
  if (!p) return console.error("No access token found!"), [];
  try {
    return (_c = (_b = (_a = await (await fetch(`https://dev-api-tm.labsquire.com/v3.0/projects/all?page=${o}&page_size=${i}&search_string=${s}&status=${r}&order_by=${l}`, { method: "GET", headers: { "Content-Type": "application/json", Authorization: `Bearer ${p}` } })).json()) == null ? void 0 : _a.data) == null ? void 0 : _b.records) != null ? _c : [];
  } catch (n) {
    return console.error("Fetch error:", n), [];
  }
}, _ = () => {
  const [o, i] = useState(null), [s, r] = useState(1), [l, p] = useState(12), [n, u] = useState(""), [m, d] = useState("true"), [h, b] = useState("created_at:asc"), x = useNavigate(), { data: g = [], isLoading: N, error: v, refetch: y } = useQuery({ queryKey: ["projects", s, l, n, m, h], queryFn: () => T({ page: s, pageSize: l, search: n, status: m, orderBy: h }) });
  return N ? jsx("p", { children: "Loading..." }) : v ? jsx("p", { children: "Error loading data." }) : jsxs("div", { className: "p-6", children: [jsx("h2", { className: "text-2xl font-bold mb-4", children: "Project Dashboard" }), jsxs("div", { className: "flex justify-between items-center mb-4", children: [jsx("input", { type: "text", placeholder: "Search by Title...", value: n, onChange: (t) => u(t.target.value), className: "border px-4 py-2 rounded-md" }), jsxs("select", { value: m, onChange: (t) => d(t.target.value), className: "border px-4 py-2 rounded-md", children: [jsx("option", { value: "true", children: "Active" }), jsx("option", { value: "false", children: "Inactive" })] }), jsxs("select", { value: h, onChange: (t) => b(t.target.value), className: "border px-4 py-2 rounded-md", children: [jsx("option", { value: "title:asc", children: "Title Asc" }), jsx("option", { value: "title:desc", children: "Title Desc" }), jsx("option", { value: "created_at:asc", children: "Created On Asc" }), jsx("option", { value: "created_at:desc", children: "Created On Desc" })] }), jsxs("div", { className: "flex gap-2", children: [jsx("button", { className: "bg-green-500 text-white px-4 py-2 rounded-md", onClick: () => x({ to: "/projects/project-table" }), children: "+ Add Project" }), jsx("button", { className: "bg-green-500 text-white px-4 py-2 rounded mt-4", onClick: () => a(g), children: "Export to CSV" })] })] }), jsx("div", { className: "max-h-[500px] overflow-auto border p-4 rounded-lg", children: jsx("div", { className: "grid grid-cols-4 gap-4", children: g.length > 0 ? g.map((t) => jsxs("div", { className: "border p-4 rounded-lg shadow-lg relative", children: [jsx("div", { className: "flex justify-center mb-6", children: jsx("img", { src: "/logo2.jpg", alt: "Logo", className: "absolute top-0 left-0 w-5 h-5 m-2" }) }), jsx("h6", { className: "text-red-500 font-bold text-xs", children: t.code }), jsx("h3", { className: "text-lg font-semibold", children: t.title }), jsx("p", { className: "text-sm text-gray-600", children: t.description || "No description" }), jsxs("div", { className: "absolute bottom-4 right-4 flex space-x-2", children: [jsx("button", { className: "bg-blue-500 text-white px-3 py-1 rounded", onClick: () => i(t), children: "Edit" }), jsx("button", { className: "bg-gray-500 text-white px-3 py-1 rounded", onClick: () => x({ to: `/projects/get-single-project/${t.id}` }), children: "View" })] }), jsx("span", { className: `absolute top-4 right-4 px-2 py-1 rounded text-xs ${t.status === "true" || t.status === true ? "bg-green-500 text-white" : "bg-red-500 text-white"}`, children: t.status === "true" || t.status === true ? "Active" : "Inactive" })] }, t.id)) : jsx("p", { children: "No projects found" }) }) }), jsxs("div", { className: "flex justify-between items-center mt-6", children: [jsxs("div", { className: "flex items-center gap-2", children: [jsx("label", { className: "font-semibold", children: "Show:" }), jsx("select", { value: l, onChange: (t) => {
    p(parseInt(t.target.value, 10)), r(1);
  }, className: "border p-2 rounded", children: S.map((t) => jsxs("option", { value: t, children: [t, " / page"] }, t)) })] }), jsxs("div", { className: "flex items-center gap-2", children: [jsx("button", { onClick: () => r(s - 1), disabled: s === 1, className: "px-3 py-1 border rounded bg-gray-200 disabled:opacity-50", children: "Previous" }), jsxs("span", { children: ["Page ", s, " 1 2 3 4 .."] }), jsx("button", { onClick: () => r(s + 1), className: "px-3 py-1 border rounded bg-gray-200", children: "Next" })] })] }), o && jsx(k, { project: o, onClose: () => i(null), onUpdate: y })] });
}, B = _;

export { B as component };
//# sourceMappingURL=project-table-CvcOygil.mjs.map
