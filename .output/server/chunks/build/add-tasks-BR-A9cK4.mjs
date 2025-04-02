import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import x from 'js-cookie';
import { useNavigate } from '@tanstack/react-router';

const h = x.get("access_token"), K = async () => {
  const s = await fetch("https://dev-api-tm.labsquire.com/v3.0/projects/projects-all", { method: "GET", headers: { "Content-Type": "application/json", Authorization: `Bearer ${h}` } });
  if (!s.ok) throw new Error("Failed to fetch projects");
  return s.json();
}, Q = async () => {
  const s = await fetch("https://dev-api-tm.labsquire.com/v3.0/tasks/tags-drop-down", { method: "GET", headers: { "Content-Type": "application/json", Authorization: `Bearer ${h}` } });
  if (!s.ok) throw new Error("Failed to fetch tags");
  return s.json();
}, _ = async (s) => {
  const n = await fetch("https://dev-api-tm.labsquire.com/v3.0/tasks", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${h}` }, body: JSON.stringify(s) });
  if (!n.ok) throw new Error("Failed to submit the task");
  return n.json();
}, $ = () => {
  const s = useQueryClient(), { data: n, error: g, isLoading: k } = useQuery({ queryKey: ["projects"], queryFn: K }), { data: T, error: b, isLoading: N } = useQuery({ queryKey: ["tags"], queryFn: Q }), d = useMutation({ mutationFn: _, onSuccess: (e) => {
    alert("Task added successfully! "), console.log("Task Added:", e), s.invalidateQueries({ queryKey: ["projects"] }), s.invalidateQueries({ queryKey: ["tags"] });
  }, onError: (e) => {
    alert("Error submitting task: " + e.message);
  } }), [i, w] = useState(""), [f, x] = useState(""), [c, j] = useState(""), [u, D] = useState(""), [v, E] = useState(""), [q, C] = useState([]), S = useNavigate(), [l, m] = useState({}), P = () => {
    let e = {};
    return i.trim() ? i.trim().length < 3 && (e.taskTitle = "Minimum 3 letters are required.") : e.taskTitle = "Task Title is required.", u || (e.dueDate = "Due Date is required."), m(e), Object.keys(e).length === 0;
  }, A = (e) => {
    if (e.preventDefault(), !P()) return;
    const o = { title: i, ref_id: "", description: f, priority: v || "LOW", status: "TODO", due_date: `${u} 12:00 AM`, project_id: c ? parseInt(c) : null, users: [], groups: [] };
    d.mutate(o);
  };
  return jsxs("div", { className: "p-6 bg-gray-100 max-w-3xl mx-auto rounded-lg shadow-md", children: [jsx("h2", { className: "text-xl font-semibold mb-4", children: "Add Task" }), (k || N) && jsx("p", { children: "Loading..." }), g instanceof Error && jsxs("div", { className: "p-4 border border-red-500 bg-red-100 text-red-700 mb-3", children: [jsx("strong", { children: "Error:" }), " ", g.message] }), b instanceof Error && jsxs("div", { className: "p-4 border border-red-500 bg-red-100 text-red-700 mb-3", children: [jsx("strong", { children: "Error:" }), " ", b.message] }), jsxs("form", { onSubmit: A, className: "grid grid-cols-2 gap-4", children: [jsxs("div", { children: [jsxs("label", { className: "block font-semibold", children: ["Select Project ", jsx("span", { className: "text-red-500", children: "*" })] }), jsxs("select", { value: c, onChange: (e) => j(e.target.value), className: "w-full p-2 border rounded", required: true, children: [jsx("option", { value: "", children: "--Select Project--" }), n == null ? void 0 : n.data.map((e) => jsx("option", { value: e.id, children: e.title }, e.id))] })] }), jsxs("div", { children: [jsxs("label", { className: "block font-semibold", children: ["Due Date ", jsx("span", { className: "text-red-500", children: "*" })] }), jsx("input", { type: "date", value: u, onChange: (e) => D(e.target.value), className: "w-full p-2 border rounded" }), l.dueDate && jsx("p", { className: "text-red-500", children: l.dueDate })] }), jsxs("div", { children: [jsxs("label", { className: "block font-semibold", children: ["Priority Level", jsx("span", { className: "text-red-500", children: "*" }), " "] }), jsxs("select", { value: v, onChange: (e) => E(e.target.value), className: "w-full p-2 border rounded", children: [jsx("option", { value: "LOW", children: "Low" }), jsx("option", { value: "MEDIUM", children: "Medium" }), jsx("option", { value: "HIGH", children: "High" })] })] }), jsxs("div", { children: [jsxs("label", { className: "block font-semibold", children: ["Task Title ", jsx("span", { className: "text-red-500", children: "*" })] }), jsx("input", { type: "text", value: i, onChange: (e) => {
    const o = e.target.value;
    w(o), o.trim().length < 3 ? m((p) => ({ ...p, taskTitle: "Minimum 3 letters are required." })) : m((p) => ({ ...p, taskTitle: "" }));
  }, className: "w-full p-2 border rounded" }), l.taskTitle && jsx("p", { className: "text-red-500", children: l.taskTitle })] }), jsxs("div", { className: "col-span-2", children: [jsx("label", { className: "block font-semibold", children: "Description" }), jsx("textarea", { value: f, onChange: (e) => x(e.target.value), className: "w-full p-2 border rounded" })] }), jsxs("div", { className: "col-span-2", children: [jsx("label", { className: "block font-semibold", children: "Tags" }), jsx("select", { multiple: true, value: q, onChange: (e) => C(Array.from(e.target.selectedOptions, (o) => o.value)), className: "w-full p-2 border rounded", children: T == null ? void 0 : T.data.map((e) => jsx("option", { value: e.id, children: e.title }, e.id)) })] }), jsxs("div", { className: "col-span-2 flex justify-between", children: [jsx("button", { type: "button", className: "px-4 py-2 bg-gray-500 text-white rounded", onClick: () => S({ to: "/tasks/get-task-stats" }), children: "Cancel" }), jsx("button", { type: "submit", className: "px-4 py-2 bg-blue-500 text-white rounded", disabled: d.isPending, children: d.isPending ? "Submitting..." : "Submit" })] })] })] });
}, W = $;

export { W as component };
//# sourceMappingURL=add-tasks-BR-A9cK4.mjs.map
