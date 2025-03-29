import { jsxs, jsx } from 'react/jsx-runtime';
import { useRouter, useNavigate, Outlet } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { LayoutDashboard, Network, ListChecks, Users, CircleUser, KeyRound, CircleArrowLeft } from 'lucide-react';

function v() {
  const [i, a] = useState(false), [p, n] = useState(false), [m, o] = useState(null);
  useRouter();
  const s = useNavigate(), g = "Sudhashini";
  return useEffect(() => {
    const c = localStorage.getItem("authState");
    if (c) try {
      const r = JSON.parse(c);
      console.log("Stored authState in localStorage:", r), r && r.user && r.user.role ? o(r.user.role) : (console.warn("Role not found in authState, defaulting to user"), o("user"));
    } catch (r) {
      console.error("Error parsing authState object:", r), o("user");
    }
    else console.warn("No authState found in localStorage, defaulting to user"), o("user");
  }, []), useEffect(() => {
    localStorage.getItem("loginSuccess") === "true" && (n(true), setTimeout(() => {
      n(false), localStorage.removeItem("loginSuccess");
    }, 3e3));
  }, []), jsxs("div", { className: "flex h-screen", children: [jsxs("aside", { className: "w-1/5 bg-white p-6 border-r-2 border-gray-300 left-0 top-0", children: [jsx("div", { className: "flex justify-center mb-6", children: jsx("img", { src: "/lab.jpg", alt: "Logo", className: "w-500 h-40 rounded-full" }) }), jsxs("button", { className: "flex items-center gap-3 px-4 py-2 text-black hover:text-sky-500", onClick: () => s({ to: "/reset-password" }), children: [jsx(LayoutDashboard, { size: 20 }), "Dashboard"] }), jsxs("button", { className: "flex items-center gap-3 px-4 py-2 text-black hover:text-sky-500", onClick: () => s({ to: "/projects/project-table" }), children: [jsx(Network, { size: 20 }), "Projects"] }), jsxs("button", { className: "flex items-center gap-3 px-4 py-2 text-black hover:text-sky-500", onClick: () => s({ to: "/tasks/get-task-stats" }), children: [jsx(ListChecks, { size: 20 }), "Tasks"] }), m === "admin" && jsxs("button", { className: "flex items-center gap-3 px-4 py-2 text-black hover:text-sky-500", onClick: () => s({ to: "/users/user-table" }), children: [jsx(Users, { size: 20 }), "Users"] })] }), jsxs("div", { className: "flex flex-col flex-1", children: [jsx("nav", { className: "bg-white p-4 border-b border-gray-300 flex justify-end items-center relative", children: jsxs("div", { className: "relative", children: [jsx("button", { onClick: () => s({ to: "/tasks/add-tasks" }), children: "+Add Task" }), jsxs("button", { onClick: () => a(!i), className: "flex items-center gap-2 font-semibold text-gray-700 hover:text-gray-900", children: [jsx(CircleUser, { size: 24 }), g] }), i && jsx("div", { className: "absolute top-10 right-0 bg-white shadow-lg rounded-md w-48 z-10 border border-gray-200", children: jsxs("ul", { className: "list-none p-0 m-0", children: [jsxs("li", { onClick: () => {
    s({ to: "/get-profile" }), a(false);
  }, className: "flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100", children: [jsx(CircleUser, { size: 18 }), "View Profile"] }), jsxs("li", { onClick: () => {
    s({ to: "/update-password" }), a(false);
  }, className: "flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100", children: [jsx(KeyRound, { size: 18 }), "Update Password"] }), jsxs("li", { onClick: () => {
    localStorage.clear(), s({ to: "/sign-in" });
  }, className: "flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 text-red-500", children: [jsx(CircleArrowLeft, { size: 18 }), "Logout"] })] }) })] }) }), jsx("main", { className: "flex-1 p-6 border border-gray-300 m-6 rounded-md", children: jsx(Outlet, {}) })] }), p && jsx("div", { className: "fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-md shadow-md font-semibold", children: "Login Successful!" })] });
}
const O = v;

export { O as component };
//# sourceMappingURL=_labsquire-BspXxI4i.mjs.map
