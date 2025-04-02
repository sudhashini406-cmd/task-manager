import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import x from 'js-cookie';
import { useNavigate } from '@tanstack/react-router';

const A = ({ project: n, onClose: c, onUpdate: d }) => {
  const [o, r] = useState({ id: 0, title: "", code: "", description: "", timezone: "" }), [s, l] = useState(false);
  useEffect(() => {
    n && r(n);
  }, [n]);
  const u = (p) => {
    r({ ...o, [p.target.name]: p.target.value });
  }, h = async () => {
    const p = x.get("access_token");
    if (!(!p || !o.id)) try {
      (await (await fetch(`https://dev-api-tm.labsquire.com/v3.0/projects/${o.id}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${p}` }, body: JSON.stringify({ title: o.title, code: o.code, description: o.description, timezone: o.timezone }) })).json()).success && (l(true), d(), setTimeout(() => {
        l(false), c();
      }, 1e3));
    } catch (m) {
      console.error("Update error:", m);
    }
  };
  return n ? jsxs("div", { className: "fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50", children: [jsxs("div", { className: "bg-white p-6 rounded-lg shadow-lg w-96", children: [jsx("h2", { className: "text-xl font-bold mb-4", children: "Edit Project" }), jsxs("label", { className: "block font-semibold", children: ["Title", jsx("span", { className: "text-red-500", children: "*" })] }), jsx("input", { type: "text", name: "title", value: o.title, onChange: u, className: "w-full p-2 border rounded mt-1" }), jsxs("label", { className: "block font-semibold mt-2", children: ["Project Code", jsx("span", { className: "text-red-500", children: "*" })] }), jsx("input", { type: "text", name: "code", value: o.code, onChange: u, className: "w-full p-2 border rounded mt-1" }), jsx("label", { className: "block font-semibold mt-2", children: "Project Description" }), jsx("textarea", { name: "description", value: o.description, onChange: u, className: "w-full p-2 border rounded mt-1" }), jsxs("div", { className: "flex justify-between mt-4", children: [jsx("button", { onClick: h, className: "bg-blue-500 text-white px-4 py-2 rounded", children: "Save" }), jsx("button", { onClick: c, className: "bg-gray-400 text-white px-4 py-2 rounded", children: "Cancel" })] })] }), s && jsx("div", { className: "fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-500", children: "Project updated successfully!" })] }) : null;
}, T = (n) => {
  if (!n || n.length === 0) {
    console.error("No data to export");
    return;
  }
  const c = n.map((s) => ({ Code: s.code || "N/A", Title: s.title || "N/A", Description: s.description || "N/A", Status: s.status === true || s.status === "true" ? "Active" : "Inactive" }));
  console.log("CSV Data:", c);
  const d = "data:text/csv;charset=utf-8," + [["Code", "Title", "Description", "Status"], ...c.map((s) => [s.Code, s.Title, s.Description, s.Status].join(","))].join(`
`), o = encodeURI(d), r = document.createElement("a");
  r.setAttribute("href", o), r.setAttribute("download", "projects.csv"), document.body.appendChild(r), r.click();
}, D = [12, 25, 50, 100, 250, 500], E = async ({ page: n, pageSize: c, search: d = "", status: o = "", orderBy: r = "created_at:desc" }) => {
  var _a, _b;
  const s = x.get("access_token");
  if (!s) return console.error("No access token found!"), [];
  try {
    const u = await (await fetch(`https://dev-api-tm.labsquire.com/v3.0/projects/all?page=${n}&page_size=${c}&search_string=${d}&status=${o}&order_by=${r}`, { method: "GET", headers: { "Content-Type": "application/json", Authorization: `Bearer ${s}` } })).json();
    return console.log("API Response:", u), (_b = (_a = u == null ? void 0 : u.data) == null ? void 0 : _a.records) != null ? _b : [];
  } catch (l) {
    return console.error("Fetch error:", l), [];
  }
}, _ = () => {
  const [n, c] = useState(""), [d, o] = useState(null), [r, s] = useState(1), [l, u] = useState(12), [h, p] = useState(""), [m, v] = useState("true"), [b, y] = useState("created_at:desc"), x = useNavigate(), { data: g = [], isLoading: C, error: w, refetch: S, isSuccess: P } = useQuery({ queryKey: ["projects", r, l, h, m, b], queryFn: () => E({ page: r, pageSize: l, search: h, status: m, orderBy: b }) });
  return C ? jsx("p", { children: "Loading..." }) : w ? jsx("p", { children: "Error loading data." }) : (useEffect(() => {
    const t = localStorage.getItem("ProjectSuccessMsg");
    t && (c(t), localStorage.removeItem("ProjectSuccessMsg"));
  }, []), jsxs("div", { children: [n && jsx("div", { className: "popup-message", children: jsx("p", { children: n }) }), jsxs("div", { className: "p-6", children: [jsx("h2", { className: "text-2xl font-bold mb-4", children: "Project Dashboard" }), jsxs("div", { className: "flex justify-between items-center mb-4", children: [jsx("input", { type: "text", placeholder: "Search by Title...", value: h, onChange: (t) => p(t.target.value), className: "border px-4 py-2 rounded-md" }), jsxs("select", { value: m, onChange: (t) => v(t.target.value), className: "border px-4 py-2 rounded-md", children: [jsx("option", { value: "true", children: "Active" }), jsx("option", { value: "false", children: "Inactive" })] }), jsxs("select", { value: b, onChange: (t) => y(t.target.value), className: "border px-4 py-2 rounded-md", children: [jsx("option", { value: "title:asc", children: "Title Asc" }), jsx("option", { value: "title:desc", children: "Title Desc" }), jsx("option", { value: "created_at:asc", children: "Created On Asc" }), jsx("option", { value: "created_at:desc", children: "Created On Desc" })] }), jsxs("div", { className: "flex gap-2", children: [jsx("button", { className: "bg-green-500 text-white px-4 py-2 rounded-md", onClick: () => x({ to: "/projects/add-project" }), children: "+ Add Project" }), jsx("button", { className: "bg-green-500 text-white px-4 py-2 rounded mt-4", onClick: () => T(g), children: "Export to CSV" })] })] }), jsx("div", { className: "max-h-[500px] overflow-auto border p-4 rounded-lg", children: jsx("div", { className: "grid grid-cols-4 gap-4", children: g.length > 0 ? g.map((t) => jsxs("div", { className: "border p-4 rounded-lg shadow-lg relative", children: [jsx("div", { className: "flex justify-center mb-6", children: jsx("img", { src: "/logo2.jpg", alt: "Logo", className: "absolute top-0 left-0 w-5 h-5 m-2" }) }), jsx("h6", { className: "text-red-500 font-bold text-xs", children: t.code }), jsx("h3", { className: "text-lg font-semibold", children: t.title }), jsx("p", { className: "text-sm text-gray-600", children: t.description || "No description" }), jsxs("div", { className: "absolute bottom-4 right-4 flex space-x-2", children: [jsx("button", { className: "bg-blue-500 text-white px-3 py-1 rounded", onClick: () => o(t), children: "Edit" }), jsx("button", { className: "bg-gray-500 text-white px-3 py-1 rounded", onClick: () => x({ to: `/projects/get-single-project/${t.id}` }), children: "View" })] }), jsx("span", { className: `absolute top-4 right-4 px-2 py-1 rounded text-xs ${t.active === true || t.active === "true" || t.active === 1 ? "bg-green-500 text-white" : "bg-red-500 text-white"}`, children: t.active === true || t.active === "true" || t.active === 1 ? "Active" : "Inactive" })] }, t.id)) : jsx("p", { children: "No projects found" }) }) }), jsxs("div", { className: "flex justify-between items-center mt-6", children: [jsxs("div", { className: "flex items-center gap-2", children: [jsx("label", { className: "font-semibold", children: "Show:" }), jsx("select", { value: l, onChange: (t) => {
    u(parseInt(t.target.value, 10)), s(1);
  }, className: "border p-2 rounded", children: D.map((t) => jsxs("option", { value: t, children: [t, " / page"] }, t)) })] }), jsxs("div", { className: "flex items-center gap-2", children: [jsx("button", { onClick: () => s(r - 1), disabled: r === 1, className: "px-3 py-1 border rounded bg-gray-200 disabled:opacity-50", children: "Previous" }), jsxs("span", { children: ["Page ", r, " "] }), jsx("button", { onClick: () => s(r + 1), className: "px-3 py-1 border rounded bg-gray-200", children: "Next" })] })] }), P && g.length > 0 && jsxs("div", { className: "mt-4 text-lg font-semibold", children: ["Total Projects: ", g.length] }), d && jsx(A, { project: d, onClose: () => o(null), onUpdate: S })] })] }));
}, B = _;

export { B as component };
//# sourceMappingURL=project-table-DAGAc_5h.mjs.map
