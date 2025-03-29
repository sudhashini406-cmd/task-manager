import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import N$1 from 'js-cookie';
import { useNavigate } from '@tanstack/react-router';

const N = async (o) => {
  const a = N$1.get("access_token");
  if (!a) throw new Error("Authorization Token Missing. Please log in.");
  const r = await fetch("https://dev-api-tm.labsquire.com/v3.0/projects", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${a}` }, body: JSON.stringify(o) });
  if (!r.ok) {
    const i = await r.json();
    throw new Error(i.message || "Failed to create project");
  }
  return r.json();
}, C = () => {
  const [o, a] = useState({ title: "", code: "", description: "", timezone: "America/Chicago", project_members: [] }), [r, i] = useState({}), p = useNavigate(), u = useQueryClient(), l = useMutation({ mutationFn: N, onSuccess: (t) => {
    console.log("Project Data:", t), a({ title: "", code: "", description: "", timezone: "America/Chicago", project_members: [] }), i({}), u.invalidateQueries({ queryKey: ["projects"] });
  }, onError: (t) => {
    alert("Error: " + t.message);
  } }), s = (t) => {
    const { name: c, value: d } = t.target;
    a({ ...o, [c]: d }), d.trim() !== "" && i((b) => ({ ...b, [c]: "" }));
  }, h = () => {
    let t = {};
    return o.title.trim() || (t.title = "Title is required."), o.code.trim() || (t.code = "Project Code is required."), i(t), Object.keys(t).length === 0;
  };
  return jsxs("div", { className: "max-w-md mx-auto p-4 border rounded-lg shadow-lg bg-white", children: [jsx("h2", { className: "text-xl font-bold mb-4", children: "Add Project" }), jsxs("form", { onSubmit: (t) => {
    t.preventDefault(), h() && l.mutate(o);
  }, children: [jsxs("label", { className: "block font-semibold", children: ["Title ", jsx("span", { className: "text-red-500", children: "*" })] }), jsx("input", { type: "text", name: "title", placeholder: "Enter Title", value: o.title, onChange: s, className: "w-full p-2 border rounded mb-1" }), r.title && jsx("p", { className: "text-red-500 text-sm", children: r.title }), jsxs("label", { className: "block font-semibold", children: ["Project Code ", jsx("span", { className: "text-red-500", children: "*" })] }), jsx("input", { type: "text", name: "code", placeholder: "Enter Code", value: o.code, onChange: s, className: "w-full p-2 border rounded mb-1" }), r.code && jsx("p", { className: "text-red-500 text-sm", children: r.code }), jsx("label", { className: "block font-semibold", children: "Project Description" }), jsx("textarea", { name: "description", placeholder: "Enter Project Description", value: o.description, onChange: s, className: "w-full p-2 border rounded mb-3" }), jsxs("label", { className: "block font-semibold", children: ["Select Timezone ", jsx("span", { className: "text-red-500", children: "*" })] }), jsxs("select", { name: "timezone", value: o.timezone, onChange: s, className: "w-full p-2 border rounded mb-3", children: [jsx("option", { value: "America/Chicago", children: "(GMT-5:00) Central Time" }), jsx("option", { value: "America/New_York", children: "(GMT-4:00) Eastern Time" }), jsx("option", { value: "America/Los_Angeles", children: "(GMT-7:00) Pacific Time" })] }), jsxs("div", { className: "flex justify-between mt-4", children: [jsx("button", { type: "button", className: "px-4 py-2 bg-gray-500 text-white rounded", onClick: () => p({ to: "/projects/project-table" }), children: "Cancel" }), jsx("button", { type: "submit", disabled: l.isPending, className: "px-4 py-2 bg-blue-600 text-white rounded", children: l.isPending ? "Adding..." : "Add Project" })] })] })] });
}, A = C;

export { A as component };
//# sourceMappingURL=add-project-NeOJyKaG.mjs.map
