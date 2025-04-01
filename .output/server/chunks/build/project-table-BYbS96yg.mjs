import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import x from 'js-cookie';
import { useNavigate } from '@tanstack/react-router';

const P = ({ project: r, onClose: l, onUpdate: c }) => {
  const [s, n] = useState({ id: 0, title: "", code: "", description: "", timezone: "" }), [o, i] = useState(false);
  useEffect(() => {
    r && n(r);
  }, [r]);
  const p = (u) => {
    n({ ...s, [u.target.name]: u.target.value });
  }, m = async () => {
    const u = x.get("access_token");
    if (!(!u || !s.id)) try {
      (await (await fetch(`https://dev-api-tm.labsquire.com/v3.0/projects/${s.id}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${u}` }, body: JSON.stringify({ title: s.title, code: s.code, description: s.description, timezone: s.timezone }) })).json()).success && (i(true), c(), setTimeout(() => {
        i(false), l();
      }, 1e3));
    } catch (h) {
      console.error("Update error:", h);
    }
  };
  return r ? jsxs("div", { className: "fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50", children: [jsxs("div", { className: "bg-white p-6 rounded-lg shadow-lg w-96", children: [jsx("h2", { className: "text-xl font-bold mb-4", children: "Edit Project" }), jsxs("label", { className: "block font-semibold", children: ["Title", jsx("span", { className: "text-red-500", children: "*" })] }), jsx("input", { type: "text", name: "title", value: s.title, onChange: p, className: "w-full p-2 border rounded mt-1" }), jsxs("label", { className: "block font-semibold mt-2", children: ["Project Code", jsx("span", { className: "text-red-500", children: "*" })] }), jsx("input", { type: "text", name: "code", value: s.code, onChange: p, className: "w-full p-2 border rounded mt-1" }), jsx("label", { className: "block font-semibold mt-2", children: "Project Description" }), jsx("textarea", { name: "description", value: s.description, onChange: p, className: "w-full p-2 border rounded mt-1" }), jsxs("div", { className: "flex justify-between mt-4", children: [jsx("button", { onClick: m, className: "bg-blue-500 text-white px-4 py-2 rounded", children: "Save" }), jsx("button", { onClick: l, className: "bg-gray-400 text-white px-4 py-2 rounded", children: "Cancel" })] })] }), o && jsx("div", { className: "fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-500", children: "Project updated successfully!" })] }) : null;
}, k = (r) => {
  if (!r || r.length === 0) {
    console.error("No data to export");
    return;
  }
  const l = r.map((o) => ({ Code: o.code || "N/A", Title: o.title || "N/A", Description: o.description || "N/A", Status: o.status === true || o.status === "true" ? "Active" : "Inactive" }));
  console.log("CSV Data:", l);
  const c = "data:text/csv;charset=utf-8," + [["Code", "Title", "Description", "Status"], ...l.map((o) => [o.Code, o.Title, o.Description, o.Status].join(","))].join(`
`), s = encodeURI(c), n = document.createElement("a");
  n.setAttribute("href", s), n.setAttribute("download", "projects.csv"), document.body.appendChild(n), n.click();
}, T = [12, 25, 50, 100, 250, 500], A = async ({ page: r, pageSize: l, search: c = "", status: s = "", orderBy: n = "created_at:desc" }) => {
  var _a, _b, _c;
  const o = x.get("access_token");
  if (!o) return console.error("No access token found!"), [];
  try {
    return (_c = (_b = (_a = await (await fetch(`https://dev-api-tm.labsquire.com/v3.0/projects/all?page=${r}&page_size=${l}&search_string=${c}&status=${s}&order_by=${n}`, { method: "GET", headers: { "Content-Type": "application/json", Authorization: `Bearer ${o}` } })).json()) == null ? void 0 : _a.data) == null ? void 0 : _b.records) != null ? _c : [];
  } catch (i) {
    return console.error("Fetch error:", i), [];
  }
}, D = () => {
  const [r, l] = useState(null), [c, s] = useState(1), [n, o] = useState(12), [i, p] = useState(""), [m, u] = useState("true"), [h, b] = useState("created_at:asc"), x = useNavigate(), { data: g = [], isLoading: v, error: N, refetch: y, isSuccess: C } = useQuery({ queryKey: ["projects", c, n, i, m, h], queryFn: () => A({ page: c, pageSize: n, search: i, status: m, orderBy: h }) });
  return v ? jsx("p", { children: "Loading..." }) : N ? jsx("p", { children: "Error loading data." }) : jsxs("div", { className: "p-6", children: [jsx("h2", { className: "text-2xl font-bold mb-4", children: "Project Dashboard" }), jsxs("div", { className: "flex justify-between items-center mb-4", children: [jsx("input", { type: "text", placeholder: "Search by Title...", value: i, onChange: (t) => p(t.target.value), className: "border px-4 py-2 rounded-md" }), jsxs("select", { value: m, onChange: (t) => u(t.target.value), className: "border px-4 py-2 rounded-md", children: [jsx("option", { value: "true", children: "Active" }), jsx("option", { value: "false", children: "Inactive" })] }), jsxs("select", { value: h, onChange: (t) => b(t.target.value), className: "border px-4 py-2 rounded-md", children: [jsx("option", { value: "title:asc", children: "Title Asc" }), jsx("option", { value: "title:desc", children: "Title Desc" }), jsx("option", { value: "created_at:asc", children: "Created On Asc" }), jsx("option", { value: "created_at:desc", children: "Created On Desc" })] }), jsxs("div", { className: "flex gap-2", children: [jsx("button", { className: "bg-green-500 text-white px-4 py-2 rounded-md", onClick: () => x({ to: "/projects/add-project" }), children: "+ Add Project" }), jsx("button", { className: "bg-green-500 text-white px-4 py-2 rounded mt-4", onClick: () => k(g), children: "Export to CSV" })] })] }), jsx("div", { className: "max-h-[500px] overflow-auto border p-4 rounded-lg", children: jsx("div", { className: "grid grid-cols-4 gap-4", children: g.length > 0 ? g.map((t) => jsxs("div", { className: "border p-4 rounded-lg shadow-lg relative", children: [jsx("div", { className: "flex justify-center mb-6", children: jsx("img", { src: "/logo2.jpg", alt: "Logo", className: "absolute top-0 left-0 w-5 h-5 m-2" }) }), jsx("h6", { className: "text-red-500 font-bold text-xs", children: t.code }), jsx("h3", { className: "text-lg font-semibold", children: t.title }), jsx("p", { className: "text-sm text-gray-600", children: t.description || "No description" }), jsxs("div", { className: "absolute bottom-4 right-4 flex space-x-2", children: [jsx("button", { className: "bg-blue-500 text-white px-3 py-1 rounded", onClick: () => l(t), children: "Edit" }), jsx("button", { className: "bg-gray-500 text-white px-3 py-1 rounded", onClick: () => x({ to: `/projects/get-single-project/${t.id}` }), children: "View" })] }), jsx("span", { className: `absolute top-4 right-4 px-2 py-1 rounded text-xs ${t.status === "true" || t.status === true ? "bg-green-500 text-white" : "bg-red-500 text-white"}`, children: t.status === "true" || t.status === true ? "Active" : "Inactive" })] }, t.id)) : jsx("p", { children: "No projects found" }) }) }), jsxs("div", { className: "flex justify-between items-center mt-6", children: [jsxs("div", { className: "flex items-center gap-2", children: [jsx("label", { className: "font-semibold", children: "Show:" }), jsx("select", { value: n, onChange: (t) => {
    o(parseInt(t.target.value, 10)), s(1);
  }, className: "border p-2 rounded", children: T.map((t) => jsxs("option", { value: t, children: [t, " / page"] }, t)) })] }), jsxs("div", { className: "flex items-center gap-2", children: [jsx("button", { onClick: () => s(c - 1), disabled: c === 1, className: "px-3 py-1 border rounded bg-gray-200 disabled:opacity-50", children: "Previous" }), jsxs("span", { children: ["Page ", c, " "] }), jsx("button", { onClick: () => s(c + 1), className: "px-3 py-1 border rounded bg-gray-200", children: "Next" })] })] }), C && g.length > 0 && jsxs("div", { className: "mt-4 text-lg font-semibold", children: ["Total Projects: ", g.length] }), r && jsx(P, { project: r, onClose: () => l(null), onUpdate: y })] });
}, U = D;

export { U as component };
//# sourceMappingURL=project-table-BYbS96yg.mjs.map
