import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from '@tanstack/react-router';
import x from 'js-cookie';
import { Store } from '@tanstack/store';
import { Mail, LockKeyhole, Eye, EyeOff } from 'lucide-react';

const k = () => {
  try {
    const r = localStorage.getItem("authState");
    return r ? JSON.parse(r) : { user: null };
  } catch {
    return { user: null };
  }
}, P = k(), u = new Store(P), _ = (r) => {
  u.setState((a) => ({ ...a, ...r }));
}, K = () => {
  const r = "https://dev-api-tm.labsquire.com/v3.0/auth/login", [a, p] = useState(false), [n, l] = useState(""), g = useNavigate(), { register: m, handleSubmit: f, setValue: I, getValues: A, formState: { errors: i } } = useForm(), { mutate: h, isPending: c } = useMutation({ mutationKey: ["login"], mutationFn: async (t) => {
    if (!t.email.endsWith("@gmail.com")) throw new Error("Email must be a valid Gmail address");
    const s = await fetch(r, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(t) });
    if (s.status === 401) throw new Error("Invalid credentials");
    if (!s.ok) throw new Error("Login failed. Please try again.");
    return s.json();
  }, onSuccess: (t) => {
    var _a;
    if ((t == null ? void 0 : t.status) !== 200 || !((_a = t == null ? void 0 : t.data) == null ? void 0 : _a.user_details)) {
      l("Invalid response from server.");
      return;
    }
    const s = t.data.access_token;
    x.set("access_token", s, { expires: 7, secure: false }), _({ user: { email: t.data.user_details.email, token: s, role: t.data.user_details.user_type } }), g({ to: "/projects/project-table" });
  }, onError: (t) => {
    l(t.message);
  } });
  return jsxs("div", { className: "flex flex-col items-center justify-center h-screen bg-gray-100", children: [jsx("img", { src: "lab.jpg", alt: "Lab", className: "absolute top-0 left-0 w-50 h-30 m-4" }), jsxs("div", { className: "max-w-md p-6 text-left bg-white rounded-lg shadow-lg absolute right-150 ", children: [jsx("h1", { style: { fontSize: "20px", fontWeight: "bold", color: "black", textAlign: "left" }, children: "Login" }), jsx("p", { children: "Your account awaits. Enter your details to get" }), jsx("p", { children: "started!" }), jsx("br", {}), jsxs("form", { onSubmit: f((t) => {
    if (l(""), !/^[a-zA-Z0-9._%+-]+@(gmail\.com|gmial\.com)$/i.test(t.email)) {
      l("Email must be a valid Gmail address");
      return;
    }
    h(t);
  }), noValidate: true, className: "flex flex-col space-y-4", children: [jsxs("div", { className: "relative", children: [jsx(Mail, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" }), jsx("input", { type: "email", placeholder: "Email", ...m("email", { required: "Email is required", pattern: { value: /^[a-zA-Z0-9._%+-]+@(gmail\.com|gmial\.com)$/i, message: "Email must be a valid Gmail address" } }), className: "w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" }), i.email && jsx("p", { className: "text-red-500 text-sm", children: i.email.message })] }), jsxs("div", { className: "relative", children: [jsx(LockKeyhole, { className: "absolute left-3 top-1/3 transform -translate-y-1/2 text-gray-600" }), jsx("input", { type: a ? "text" : "password", placeholder: "Password", ...m("password", { required: "Password is required" }), className: "w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" }), jsx("span", { onClick: () => p(!a), className: "absolute right-3 top-1/3 transform -translate-y-1/2 cursor-pointer text-gray-600", children: a ? jsx(Eye, {}) : jsx(EyeOff, {}) }), i.password && jsx("p", { className: "text-red-500 text-sm", children: i.password.message }), jsx("a", { href: "/forgot-password", className: "block text-blue-500 text-sm mt-1 absolute right-2 ", children: "Forgot Password?" })] }), n && jsx("p", { className: "text-red-500 text-sm", children: n }), jsx("button", { type: "submit", disabled: c, className: "w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 mt-8", children: c ? "Logging in..." : "Log In" })] })] })] });
};

export { K };
//# sourceMappingURL=SignIn-85yXu8KM.mjs.map
