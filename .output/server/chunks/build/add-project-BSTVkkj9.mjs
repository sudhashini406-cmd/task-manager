import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import x from 'js-cookie';
import { useNavigate } from '@tanstack/react-router';

const N = async (c) => {
  const o = x.get("access_token");
  if (!o) throw new Error("Authorization Token Missing. Please log in.");
  const a = await fetch("https://dev-api-tm.labsquire.com/v3.0/projects", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${o}` }, body: JSON.stringify(c) });
  if (!a.ok) {
    const s = await a.json();
    throw new Error(s.message || "Failed to create project");
  }
  return a.json();
}, C = ({ onProjectAdded: c }) => {
  const [o, a] = useState({ title: "", code: "", description: "", timezone: "America/Chicago", project_members: [] }), [s, n] = useState({}), p = useNavigate(), b = useQueryClient(), d = useMutation({ mutationFn: N, onSuccess: (t) => {
    console.log("Project Data:", t), a({ title: "", code: "", description: "", timezone: "America/Chicago", project_members: [] }), n({}), localStorage.setItem("ProjectSuccessMsg", "project added successfully"), b.invalidateQueries({ queryKey: ["projects"] }), p({ to: "/projects/project-table" }), c && c();
  }, onError: (t) => {
    t.message.includes("Project title already exists") ? n((i) => ({ ...i, title: "Project title already exists" })) : t.message.includes("Project code already exists") ? n((i) => ({ ...i, code: "Project code already exists" })) : alert("Error: " + t.message);
  } }), l = (t) => {
    const { name: i, value: u } = t.target;
    a((m) => ({ ...m, [i]: u })), u.trim() !== "" && n((m) => ({ ...m, [i]: "" }));
  }, g = () => {
    let t = {};
    return o.title.trim() || (t.title = "Title is required."), o.code.trim() || (t.code = "Project Code is required."), n(t), Object.keys(t).length === 0;
  };
  return jsxs("div", { className: "max-w-md mx-auto p-4 border rounded-lg shadow-lg bg-white", children: [jsx("h2", { className: "text-xl font-bold mb-4", children: "Add Project" }), jsxs("form", { onSubmit: (t) => {
    t.preventDefault(), g() && d.mutate(o);
  }, children: [jsxs("label", { className: "block font-semibold", children: ["Title ", jsx("span", { className: "text-red-500", children: "*" })] }), jsx("input", { type: "text", name: "title", placeholder: "Enter Title", value: o.title, onChange: l, className: "w-full p-2 border rounded mb-1" }), s.title && jsx("p", { className: "text-red-500 text-sm", children: s.title }), jsxs("label", { className: "block font-semibold", children: ["Project Code ", jsx("span", { className: "text-red-500", children: "*" })] }), jsx("input", { type: "text", name: "code", placeholder: "Enter Code", value: o.code, onChange: l, className: "w-full p-2 border rounded mb-1" }), s.code && jsx("p", { className: "text-red-500 text-sm", children: s.code }), jsx("label", { className: "block font-semibold", children: "Project Description" }), jsx("textarea", { name: "description", placeholder: "Enter Project Description", value: o.description, onChange: l, className: "w-full p-2 border rounded mb-3" }), jsxs("label", { className: "block font-semibold", children: ["Select Timezone ", jsx("span", { className: "text-red-500", children: "*" })] }), jsxs("select", { name: "timezone", value: o.timezone, onChange: l, className: "w-full p-2 border rounded mb-3", children: [jsx("option", { value: "America/Chicago", children: "(GMT-5:00) Central Time" }), jsx("option", { value: "America/New_York", children: "(GMT-4:00) Eastern Time" }), jsx("option", { value: "America/Los_Angeles", children: "(GMT-7:00) Pacific Time" })] }), jsxs("div", { className: "flex justify-between mt-4", children: [jsx("button", { type: "button", className: "px-4 py-2 bg-gray-500 text-white rounded", onClick: () => p({ to: "/projects/project-table" }), children: "Cancel" }), jsx("button", { type: "submit", disabled: d.isPending, className: "px-4 py-2 bg-blue-600 text-white rounded", children: d.isPending ? "Adding..." : "Add Project" })] })] })] });
}, S = C;

export { S as component };
//# sourceMappingURL=add-project-BSTVkkj9.mjs.map
