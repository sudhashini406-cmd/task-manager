import { jsx, jsxs } from 'react/jsx-runtime';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import N$1 from 'js-cookie';
import { useParams } from '@tanstack/react-router';
import { useState, useMemo, useRef, useEffect } from 'react';
import { O, _ } from './GetMembers-CUvba0q7.mjs';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { DndProvider, useDrop, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const D = N$1.get("access_token"), V = async (e) => {
  if (!e) throw new Error("Project ID is missing");
  const r = await fetch(`https://dev-api-tm.labsquire.com/v3.0/projects/${e}/user-groups`, { method: "GET", headers: { Authorization: `Bearer ${D}`, "Content-Type": "application/json" } });
  if (r.status == 404) return [];
  if (!r.ok) throw new Error("Failed to fetch project groups");
  return (await r.json()).data;
}, Q = async ({ projectId: e, groupId: r }) => {
  const a = await fetch(`https://dev-api-tm.labsquire.com/v3.0/projects/${e}/user-groups`, { method: "POST", headers: { Authorization: `Bearer ${D}`, "Content-Type": "application/json" }, body: JSON.stringify({ project_user_groups: [{ group_id: r, role: "MANAGER" }] }) });
  if (!a.ok) throw new Error("Failed to add project group");
  return a.json();
}, J = async ({ projectId: e, groupId: r }) => {
  if (!(await fetch(`https://dev-api-tm.labsquire.com/v3.0/projects/${e}/user-groups`, { method: "DELETE", headers: { Authorization: `Bearer ${D}`, "Content-Type": "application/json" }, body: JSON.stringify({ project_user_group_id: r }) })).ok) throw new Error("Failed to delete project group");
  return r;
}, H = () => {
  const { projectId: e } = useParams({ strict: false }), r = useQueryClient(), [a, p] = useState(""), [i, m] = useState(false), { data: d, isLoading: f, error: g } = useQuery({ queryKey: ["projectGroups", e], queryFn: () => V(e != null ? e : ""), enabled: !!e }), u = useMutation({ mutationFn: Q, onSuccess: () => {
    r.invalidateQueries({ queryKey: ["projectGroups", e] });
  } }), j = useMutation({ mutationFn: J, onSuccess: () => {
    r.invalidateQueries({ queryKey: ["projectGroups", e] });
  } }), x = useMemo(() => [{ header: "Group ID", accessorKey: "group_id" }, { header: "Group Name", accessorKey: "group_name" }, { header: "Action", accessorKey: "action", cell: ({ row: s }) => jsx("button", { className: "bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition", onClick: () => j.mutate({ projectId: e != null ? e : "", groupId: s.original.group_id }), children: "Remove" }) }], [j, e]), v = (s) => {
    m(false), s.length > 0 && u.mutate({ projectId: e != null ? e : "", members: s.map((o) => ({ user_id: o, role: "MEMBER" })) });
  }, O = useMemo(() => d ? d.map((s) => ({ group_id: s.group_id, group_name: s.group_name })) : [], [d]), h = useReactTable({ data: O, columns: x, getCoreRowModel: getCoreRowModel() });
  return f ? jsx("p", { className: "text-center text-gray-600", children: "Loading..." }) : g ? jsxs("p", { className: "text-center text-red-500", children: ["Error: ", g.message] }) : jsxs("div", { className: "p-6", children: [jsx("h3", { className: "text-xl font-semibold text-center mb-4", children: "Project User Groups" }), jsxs("div", { className: "mb-4", children: [jsx("button", { className: "mb-4 px-4 py-2 bg-green-500 text-white rounded-md", onClick: () => m(!i), children: "AddMembers" }), i && jsx(_, { onConfirm: v })] }), jsx("div", { className: "overflow-x-auto", children: jsxs("table", { className: "w-full border-collapse border border-gray-300", children: [jsx("thead", { className: "bg-gray-100", children: h.getHeaderGroups().map((s) => jsx("tr", { className: "border-b border-gray-300", children: s.headers.map((o) => jsx("th", { className: "px-4 py-2 text-left border border-gray-300", children: flexRender(o.column.columnDef.header, o.getContext()) }, o.id)) }, s.id)) }), jsx("tbody", { children: h.getRowModel().rows.map((s) => jsx("tr", { className: "hover:bg-gray-50 transition border-b border-gray-300", children: s.getVisibleCells().map((o) => jsx("td", { className: "px-4 py-2 border border-gray-300", children: flexRender(o.column.columnDef.cell, o.getContext()) }, o.id)) }, s.id)) })] }) })] });
}, b = { projectDetails: (e) => `https://dev-api-tm.labsquire.com/v3.0/projects/${e}`, taskStats: (e) => `https://dev-api-tm.labsquire.com/v3.0/projects/${e}/task-stats`, taskTodo: (e, r, a) => `https://dev-api-tm.labsquire.com/v3.0/projects/${e}/tasks?page=${r}&page_size=${a}&status=TODO&order_by=created_at:asc`, taskInProgress: (e, r, a) => `https://dev-api-tm.labsquire.com/v3.0/projects/${e}/tasks?page=${r}&page_size=${a}&status=IN_PROGRESS&order_by=created_at:asc`, taskOverdue: (e, r, a) => `https://dev-api-tm.labsquire.com/v3.0/projects/${e}/tasks?page=${r}&page_size=${a}&status=OVER_DUE&order_by=created_at:asc`, taskCompleted: (e, r, a) => `https://dev-api-tm.labsquire.com/v3.0/projects/${e}/tasks?page=${r}&page_size=${a}&status=COMPLETED&order_by=created_at:asc`, updateTaskStatus: (e) => `https://dev-api-tm.labsquire.com/v3.0/tasks/${e}/status` }, A = N$1.get("access_token"), N = async (e) => {
  const r = await fetch(e, { method: "GET", headers: { "Content-Type": "application/json", Authorization: `Bearer ${A}` } });
  if (!r.ok) throw new Error("Failed to fetch data");
  return r.json();
}, W = ({ task: e }) => {
  const r = useRef(null), [{ isDragging: a }, p] = useDrag(() => ({ type: "TASK", item: { id: e.task_id, currentStatus: e.task_status }, collect: (i) => ({ isDragging: i.isDragging() }) }));
  return useEffect(() => {
    r.current && p(r.current);
  }, [p]), jsxs("div", { ref: r, className: `p-3 border rounded-lg bg-white shadow-md cursor-pointer ${a ? "opacity-50" : "opacity-100"}`, children: [jsx("p", { className: "font-semibold", children: e.task_title }), jsx("p", { className: "text-sm text-gray-500", children: e.task_ref_id }), jsx("p", { className: "text-sm text-gray-500", children: e.task_priority })] });
}, E = ({ title: e, status: r, tasks: a, moveTask: p }) => {
  const i = useRef(null), [, m] = useDrop(() => ({ accept: "TASK", drop: (d) => p(d.id, d.currentStatus, r) }));
  return useEffect(() => {
    i.current && m(i.current);
  }, [m]), jsxs("div", { ref: i, className: "p-3 bg-gray-100 rounded-lg", children: [jsx("h3", { className: "font-bold mb-2", children: e }), jsx("div", { className: "space-y-2", children: a.map((d) => jsx(W, { task: d }, d.task_id)) })] });
}, X = () => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
  const { projectId: e } = useParams({ strict: false }), [r, a] = useState(false), [p, i] = useState({ TODO: [], IN_PROGRESS: [], OVER_DUE: [], COMPLETED: [] }), [m, d] = useState(null);
  if (!e) return jsx("p", { className: "text-red-500", children: "Error: Project ID is missing" });
  const f = 1, g = 500, { data: u, isLoading: j, error: x, refetch: v } = useQuery({ queryKey: ["projectData", e], queryFn: async () => {
    var _a2, _b2, _c2, _d2;
    const [s, o, n, l, y, _] = await Promise.all([N(b.projectDetails(e)), N(b.taskStats(e)), N(b.taskTodo(e, f, g)), N(b.taskInProgress(e, f, g)), N(b.taskOverdue(e, f, g)), N(b.taskCompleted(e, f, g))]);
    return i({ TODO: (_a2 = n.data.records) != null ? _a2 : [], IN_PROGRESS: (_b2 = l.data.records) != null ? _b2 : [], OVER_DUE: (_c2 = y.data.records) != null ? _c2 : [], COMPLETED: (_d2 = _.data.records) != null ? _d2 : [] }), { project: s.data, taskStats: o.data };
  } }), O$1 = useMutation({ mutationFn: async ({ taskId: s, newStatus: o }) => {
    const n = await fetch(b.updateTaskStatus(s), { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${A}` }, body: JSON.stringify({ status: o }) });
    if (!n.ok) throw new Error("Failed to update task status");
    return n.json();
  }, onSuccess: () => {
    d("Task updated successfully"), v(), setTimeout(() => d(null), 4e3);
  }, onError: (s) => {
    console.error("Error updating task status:", s);
  } }), h = (s, o, n) => {
    i((l) => {
      const y = l[o].find((_) => _.task_id === s);
      return !y || o == n ? l : { ...l, [o]: l[o].filter((_) => _.task_id !== s), [n]: [...l[n], { ...y, task_status: n }] };
    }), o != n && O$1.mutate({ taskId: s, newStatus: n }, { onError: () => {
      i((l) => ({ ...l, [o]: [...l[o], l[n].pop()], [n]: l[n].filter((y) => y.task_id !== s) }));
    } });
  };
  return j ? jsx("p", { children: "Loading..." }) : x ? jsx("p", { className: "text-red-500", children: "Error loading data" }) : jsxs(DndProvider, { backend: HTML5Backend, children: [jsxs("div", { className: "grid grid-cols-5 gap-4 mb-6", children: [jsxs("div", { className: "bg-gray-200 p-4 text-center rounded-lg", children: [jsx("h4", { className: "font-semibold", children: "Total Tasks" }), jsx("p", { className: "text-lg font-bold", children: (_b = (_a = u == null ? void 0 : u.taskStats) == null ? void 0 : _a.total_tasks_count) != null ? _b : "N/A" })] }), jsxs("div", { className: "bg-blue-200 p-4 text-center rounded-lg", children: [jsx("h4", { className: "font-semibold", children: "To Do" }), jsx("p", { className: "text-lg font-bold", children: (_d = (_c = u == null ? void 0 : u.taskStats) == null ? void 0 : _c.task_todo_count) != null ? _d : "N/A" })] }), jsxs("div", { className: "bg-yellow-200 p-4 text-center rounded-lg", children: [jsx("h4", { className: "font-semibold", children: "In Progress" }), jsx("p", { className: "text-lg font-bold", children: (_f = (_e = u == null ? void 0 : u.taskStats) == null ? void 0 : _e.task_inprogress_count) != null ? _f : "N/A" })] }), jsxs("div", { className: "bg-red-200 p-4 text-center rounded-lg", children: [jsx("h4", { className: "font-semibold", children: "Overdue" }), jsx("p", { className: "text-lg font-bold", children: (_h = (_g = u == null ? void 0 : u.taskStats) == null ? void 0 : _g.task_overdue_count) != null ? _h : "N/A" })] }), jsxs("div", { className: "bg-green-200 p-4 text-center rounded-lg", children: [jsx("h4", { className: "font-semibold", children: "Completed" }), jsx("p", { className: "text-lg font-bold", children: (_j = (_i = u == null ? void 0 : u.taskStats) == null ? void 0 : _i.task_completed_count) != null ? _j : "N/A" })] })] }), jsx("h2", { className: "text-xl font-bold mb-2", children: (_l = (_k = u == null ? void 0 : u.project) == null ? void 0 : _k.title) != null ? _l : "N/A" }), jsx("p", { children: (_n = (_m = u == null ? void 0 : u.project) == null ? void 0 : _m.description) != null ? _n : "N/A" }), jsx("div", { className: "flex gap-4 mb-4", children: jsx("button", { className: "px-4 py-2 bg-blue-500 text-white rounded-lg", onClick: () => a(!r), children: r ? "Close Members" : "View Members" }) }), r && jsx(O, {}), r && jsx(H, {}), jsxs("div", { className: "grid grid-cols-4 gap-4", children: [jsx(E, { title: "TO DO", status: "TODO", tasks: p.TODO, moveTask: h }), jsx(E, { title: "In Progress", status: "IN_PROGRESS", tasks: p.IN_PROGRESS, moveTask: h }), jsx(E, { title: "Overdue", status: "OVER_DUE", tasks: p.OVER_DUE, moveTask: h }), jsx(E, { title: "Completed", status: "COMPLETED", tasks: p.COMPLETED, moveTask: h })] }), m && jsx("div", { className: "fixed top-5 right-5 bg-green-500 text-white px-10 py-6 rounded-lg shadow-lg", children: m })] });
}, ce = X;

export { ce as component };
//# sourceMappingURL=index-WJ_8OdWR.mjs.map
