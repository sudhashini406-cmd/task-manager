import { jsx, jsxs } from 'react/jsx-runtime';
import { useQuery } from '@tanstack/react-query';
import x from 'js-cookie';

const l = x.get("access_token"), c = async () => {
  const t = await fetch("https://dev-api-tm.labsquire.com/v3.0/tasks/tasks-stats", { method: "GET", headers: { "Content-Type": "application/json", Authorization: `Bearer ${l}` } });
  if (!t.ok) throw new Error("Failed to fetch task stats");
  return t.json();
}, i = () => {
  var _a, _b, _c, _d, _e;
  const { data: t, error: o, isLoading: r, isError: a } = useQuery({ queryKey: ["taskStats"], queryFn: c, staleTime: 0, refetchOnWindowFocus: true });
  return r ? jsx("div", { children: "Loading..." }) : a ? jsxs("div", { style: { padding: "10px", border: "1px solid red", background: "#ffebee", color: "red" }, children: [jsx("strong", { children: "Error:" }), " ", o.message] }) : jsx("div", { className: "p-4", children: jsxs("div", { className: "grid grid-cols-5 gap-4 mb-6", children: [jsxs("div", { className: "bg-gray-200 p-4 text-center rounded-lg", children: [jsx("h4", { className: "font-semibold", children: "Total Tasks" }), jsx("p", { className: "text-lg font-bold", children: (_a = t == null ? void 0 : t.data.total_tasks) != null ? _a : "N/A" })] }), jsxs("div", { className: "bg-blue-200 p-4 text-center rounded-lg", children: [jsx("h4", { className: "font-semibold", children: "To Do" }), jsx("p", { className: "text-lg font-bold", children: (_b = t == null ? void 0 : t.data.todo_count) != null ? _b : "N/A" })] }), jsxs("div", { className: "bg-yellow-200 p-4 text-center rounded-lg", children: [jsx("h4", { className: "font-semibold", children: "In Progress" }), jsx("p", { className: "text-lg font-bold", children: (_c = t == null ? void 0 : t.data.inProgress_count) != null ? _c : "N/A" })] }), jsxs("div", { className: "bg-red-200 p-4 text-center rounded-lg", children: [jsx("h4", { className: "font-semibold", children: "Overdue" }), jsx("p", { className: "text-lg font-bold", children: (_d = t == null ? void 0 : t.data.overDue_count) != null ? _d : "N/A" })] }), jsxs("div", { className: "bg-green-200 p-4 text-center rounded-lg", children: [jsx("h4", { className: "font-semibold", children: "Completed" }), jsx("p", { className: "text-lg font-bold", children: (_e = t == null ? void 0 : t.data.completed_count) != null ? _e : "N/A" })] })] }) });
}, g = i;

export { g as component };
//# sourceMappingURL=get-task-stats-CCPbpruE.mjs.map
