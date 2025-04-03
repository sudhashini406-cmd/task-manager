import { jsx, jsxs } from 'react/jsx-runtime';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import x from 'js-cookie';
import { useParams } from '@tanstack/react-router';
import { useState, useMemo, useRef, useEffect } from 'react';
import { O, _ } from './GetMembers-CUvba0q7.mjs';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { DndProvider, useDrop, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const D = x.get("access_token"), V = async (e) => {
  if (!e) throw new Error("Project ID is missing");
  const s = await fetch(`https://dev-api-tm.labsquire.com/v3.0/projects/${e}/user-groups`, { method: "GET", headers: { Authorization: `Bearer ${D}`, "Content-Type": "application/json" } });
  if (s.status == 404) return [];
  if (!s.ok) throw new Error("Failed to fetch project groups");
  return (await s.json()).data;
}, Q = async ({ projectId: e, groupId: s }) => {
  const o = await fetch(`https://dev-api-tm.labsquire.com/v3.0/projects/${e}/user-groups`, { method: "POST", headers: { Authorization: `Bearer ${D}`, "Content-Type": "application/json" }, body: JSON.stringify({ project_user_groups: [{ group_id: s, role: "MANAGER" }] }) });
  if (!o.ok) throw new Error("Failed to add project group");
  return o.json();
}, J = async ({ projectId: e, groupId: s }) => {
  if (!(await fetch(`https://dev-api-tm.labsquire.com/v3.0/projects/${e}/user-groups`, { method: "DELETE", headers: { Authorization: `Bearer ${D}`, "Content-Type": "application/json" }, body: JSON.stringify({ project_user_group_id: s }) })).ok) throw new Error("Failed to delete project group");
  return s;
}, H = () => {
  const { projectId: e } = useParams({ strict: false }), s = useQueryClient(), [o, p] = useState(""), [i, m] = useState(false), { data: d, isLoading: f, error: g } = useQuery({ queryKey: ["projectGroups", e], queryFn: () => V(e != null ? e : ""), enabled: !!e }), u = useMutation({ mutationFn: Q, onSuccess: () => {
    s.invalidateQueries({ queryKey: ["projectGroups", e] });
  } }), k = useMutation({ mutationFn: J, onSuccess: () => {
    s.invalidateQueries({ queryKey: ["projectGroups", e] });
  } }), E = useMemo(() => [{ header: "Group ID", accessorKey: "group_id" }, { header: "Group Name", accessorKey: "group_name" }, { header: "Action", accessorKey: "action", cell: ({ row: r }) => jsx("button", { className: "bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition", onClick: () => k.mutate({ projectId: e != null ? e : "", groupId: r.original.group_id }), children: "Remove" }) }], [k, e]), v = (r) => {
    m(false), r.length > 0 && u.mutate({ projectId: e != null ? e : "", members: r.map((a) => ({ user_id: a, role: "MEMBER" })) });
  }, O = useMemo(() => d ? d.map((r) => ({ group_id: r.group_id, group_name: r.group_name })) : [], [d]), h = useReactTable({ data: O, columns: E, getCoreRowModel: getCoreRowModel() });
  return f ? jsx("p", { className: "text-center text-gray-600", children: "Loading..." }) : g ? jsxs("p", { className: "text-center text-red-500", children: ["Error: ", g.message] }) : jsxs("div", { className: "p-6", children: [jsx("h3", { className: "text-xl font-semibold text-center mb-4", children: "Project User Groups" }), jsxs("div", { className: "mb-4", children: [jsx("button", { className: "mb-4 px-4 py-2 bg-green-500 text-white rounded-md", onClick: () => m(!i), children: "AddMembers" }), i && jsx(_, { onConfirm: v })] }), jsx("div", { className: "overflow-x-auto", children: jsxs("table", { className: "w-full border-collapse border border-gray-300", children: [jsx("thead", { className: "bg-gray-100", children: h.getHeaderGroups().map((r) => jsx("tr", { className: "border-b border-gray-300", children: r.headers.map((a) => jsx("th", { className: "px-4 py-2 text-left border border-gray-300", children: flexRender(a.column.columnDef.header, a.getContext()) }, a.id)) }, r.id)) }), jsx("tbody", { children: h.getRowModel().rows.map((r) => jsx("tr", { className: "hover:bg-gray-50 transition border-b border-gray-300", children: r.getVisibleCells().map((a) => jsx("td", { className: "px-4 py-2 border border-gray-300", children: flexRender(a.column.columnDef.cell, a.getContext()) }, a.id)) }, r.id)) })] }) })] });
}, b = { projectDetails: (e) => `https://dev-api-tm.labsquire.com/v3.0/projects/${e}`, taskStats: (e) => `https://dev-api-tm.labsquire.com/v3.0/projects/${e}/task-stats`, taskTodo: (e, s, o) => `https://dev-api-tm.labsquire.com/v3.0/projects/${e}/tasks?page=${s}&page_size=${o}&status=TODO&order_by=created_at:asc`, taskInProgress: (e, s, o) => `https://dev-api-tm.labsquire.com/v3.0/projects/${e}/tasks?page=${s}&page_size=${o}&status=IN_PROGRESS&order_by=created_at:asc`, taskOverdue: (e, s, o) => `https://dev-api-tm.labsquire.com/v3.0/projects/${e}/tasks?page=${s}&page_size=${o}&status=OVER_DUE&order_by=created_at:asc`, taskCompleted: (e, s, o) => `https://dev-api-tm.labsquire.com/v3.0/projects/${e}/tasks?page=${s}&page_size=${o}&status=COMPLETED&order_by=created_at:asc`, updateTaskStatus: (e) => `https://dev-api-tm.labsquire.com/v3.0/tasks/${e}/status` }, A = x.get("access_token"), y = async (e) => {
  const s = await fetch(e, { method: "GET", headers: { "Content-Type": "application/json", Authorization: `Bearer ${A}` } });
  if (!s.ok) throw new Error("Failed to fetch data");
  return s.json();
}, W = ({ task: e }) => {
  const s = useRef(null), [{ isDragging: o }, p] = useDrag(() => ({ type: "TASK", item: { id: e.task_id, currentStatus: e.task_status }, collect: (i) => ({ isDragging: i.isDragging() }) }));
  return useEffect(() => {
    s.current && p(s.current);
  }, [p]), jsxs("div", { ref: s, className: `p-3 border rounded-lg bg-white shadow-md cursor-pointer ${o ? "opacity-50" : "opacity-100"}`, children: [jsx("p", { className: "test-base font-semibold", children: e.task_title }), jsx("p", { className: "text-sm text-gray-500", children: e.task_ref_id }), jsx("p", { className: "text-sm text-gray-500", children: e.task_priority })] });
}, j = ({ title: e, status: s, tasks: o, moveTask: p }) => {
  const i = useRef(null), [, m] = useDrop(() => ({ accept: "TASK", drop: (d) => p(d.id, d.currentStatus, s) }));
  return useEffect(() => {
    i.current && m(i.current);
  }, [m]), jsxs("div", { ref: i, className: `p-3 bg-gray-100 rounded-lg ${o.length > 5 ? "h-64 overflow-y-auto" : ""}`, children: [jsx("h3", { className: "font-bold mb-2", children: e }), jsx("div", { className: "space-y-2", children: o.map((d) => jsx(W, { task: d }, d.task_id)) })] });
}, X = () => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
  const { projectId: e } = useParams({ strict: false }), [s, o] = useState(false), [p, i] = useState({ TODO: [], IN_PROGRESS: [], OVER_DUE: [], COMPLETED: [] }), [m, d] = useState(null);
  if (!e) return jsx("p", { className: "text-red-500", children: "Error: Project ID is missing" });
  const f = 1, g = 500, { data: u, isLoading: k, error: E, refetch: v } = useQuery({ queryKey: ["projectData", e], queryFn: async () => {
    var _a2, _b2, _c2, _d2;
    const [r, a, n, l, N, x] = await Promise.all([y(b.projectDetails(e)), y(b.taskStats(e)), y(b.taskTodo(e, f, g)), y(b.taskInProgress(e, f, g)), y(b.taskOverdue(e, f, g)), y(b.taskCompleted(e, f, g))]);
    return i({ TODO: (_a2 = n.data.records) != null ? _a2 : [], IN_PROGRESS: (_b2 = l.data.records) != null ? _b2 : [], OVER_DUE: (_c2 = N.data.records) != null ? _c2 : [], COMPLETED: (_d2 = x.data.records) != null ? _d2 : [] }), { project: r.data, taskStats: a.data };
  } }), O$1 = useMutation({ mutationFn: async ({ taskId: r, newStatus: a }) => {
    const n = await fetch(b.updateTaskStatus(r), { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${A}` }, body: JSON.stringify({ status: a }) });
    if (!n.ok) throw new Error("Failed to update task status");
    return n.json();
  }, onSuccess: () => {
    d("Task updated successfully"), v(), setTimeout(() => d(null), 4e3);
  }, onError: (r) => {
    console.error("Error updating task status:", r);
  } }), h = (r, a, n) => {
    i((l) => {
      const N = l[a].find((x) => x.task_id === r);
      return !N || a == n ? l : { ...l, [a]: l[a].filter((x) => x.task_id !== r), [n]: [...l[n], { ...N, task_status: n }] };
    }), a != n && O$1.mutate({ taskId: r, newStatus: n }, { onError: () => {
      i((l) => ({ ...l, [a]: [...l[a], l[n].pop()], [n]: l[n].filter((N) => N.task_id !== r) }));
    } });
  };
  return k ? jsx("p", { children: "Loading..." }) : E ? jsx("p", { className: "text-red-500", children: "Error loading data" }) : jsxs(DndProvider, { backend: HTML5Backend, children: [jsxs("div", { className: "grid grid-cols-5 gap-9 mb-9", children: [jsxs("div", { className: "bg-gray-200 p-4 text-center rounded-lg", children: [jsx("h4", { className: " text-base font-semibold", children: "Total Tasks" }), jsx("p", { className: "text-lg font-bold", children: jsx("span", { className: "text-2xl font-bold", children: (_b = (_a = u == null ? void 0 : u.taskStats) == null ? void 0 : _a.total_tasks_count) != null ? _b : "N/A" }) })] }), jsxs("div", { className: "bg-blue-200 p-4 text-leftrounded-lg", children: [jsx("h4", { className: " text-base  font-semibold", children: "To Do" }), jsx("p", { className: "text-lg font-bold", children: jsx("span", { className: "text-2xl font-bold", children: (_d = (_c = u == null ? void 0 : u.taskStats) == null ? void 0 : _c.task_todo_count) != null ? _d : "N/A" }) })] }), jsxs("div", { className: "bg-yellow-200 p-4 text-center rounded-lg", children: [jsx("h4", { className: "text-base  font-semibold", children: "In Progress" }), jsx("p", { className: "text-lg font-bold", children: jsx("span", { className: "text-2xl font-bold", children: (_f = (_e = u == null ? void 0 : u.taskStats) == null ? void 0 : _e.task_inprogress_count) != null ? _f : "N/A" }) })] }), jsxs("div", { className: "bg-red-200 p-4 text-center rounded-lg", children: [jsx("h4", { className: "text-base  font-semibold", children: "Overdue" }), jsx("p", { className: "text-lg font-bold", children: jsx("span", { className: "text-2xl font-bold", children: (_h = (_g = u == null ? void 0 : u.taskStats) == null ? void 0 : _g.task_overdue_count) != null ? _h : "N/A" }) })] }), jsxs("div", { className: "bg-green-200 p-4 text-center rounded-lg", children: [jsx("h4", { className: "text-base  font-semibold", children: "Completed" }), jsx("p", { className: "text-lg font-bold", children: jsx("span", { className: "text-2xl font-bold", children: (_j = (_i = u == null ? void 0 : u.taskStats) == null ? void 0 : _i.task_completed_count) != null ? _j : "N/A" }) })] })] }), jsx("h2", { className: "text-xl font-bold mb-2", children: (_l = (_k = u == null ? void 0 : u.project) == null ? void 0 : _k.title) != null ? _l : "N/A" }), jsx("p", { children: (_n = (_m = u == null ? void 0 : u.project) == null ? void 0 : _m.description) != null ? _n : "N/A" }), jsx("div", { className: "flex gap-4 mb-4", children: jsx("button", { className: "px-4 py-2 bg-blue-500 text-white rounded-lg", onClick: () => o(!s), children: s ? "Close Members" : "View Members" }) }), s && jsx(O, {}), s && jsx(H, {}), jsxs("div", { className: "grid grid-cols-4 gap-4", children: [jsx(j, { title: "TO DO", status: "TODO", tasks: p.TODO, moveTask: h }), jsx(j, { title: "In Progress", status: "IN_PROGRESS", tasks: p.IN_PROGRESS, moveTask: h }), jsx(j, { title: "Overdue", status: "OVER_DUE", tasks: p.OVER_DUE, moveTask: h }), jsx(j, { title: "Completed", status: "COMPLETED", tasks: p.COMPLETED, moveTask: h })] }), m && jsx("div", { className: "fixed top-5 right-5 bg-green-500 text-white px-10 py-6 rounded-lg shadow-lg", children: m })] });
}, ce = X;

export { ce as component };
//# sourceMappingURL=index-CZVf3ryT.mjs.map
