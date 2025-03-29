import { jsx, jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from '@tanstack/react-router';
import N from 'js-cookie';
import { Store } from '@tanstack/store';
import { Mail, LockKeyhole, Eye, EyeOff } from 'lucide-react';

const x = () => {
  try {
    const s = localStorage.getItem("authState");
    return s ? JSON.parse(s) : { user: null };
  } catch {
    return { user: null };
  }
}, T = x(), m = new Store(T), I = (s) => {
  m.setState((r) => ({ ...r, ...s }));
}, R = { BASE_URL: "/_build", CWD: "C:\\Users\\sudhashini_enugula\\Desktop\\ProjectLabsquire18", DEV: false, DEVTOOLS: false, MANIFEST: globalThis.MANIFEST, MODE: "production", PROD: true, ROUTERS: ["public", "client", "ssr", "server"], ROUTER_HANDLER: "app/ssr.tsx", ROUTER_NAME: "ssr", ROUTER_TYPE: "http", SERVER_BASE_URL: "", SSR: true, TSS_API_BASE: "/api", TSS_CLIENT_BASE: "/_build", TSS_OUTPUT_PUBLIC_DIR: "C:/Users/sudhashini_enugula/Desktop/ProjectLabsquire18/.output/public", TSS_PUBLIC_BASE: "/", VITE_API_URL: "https://dev-api-tm.labsquire.com/v3.0" }, V = () => {
  console.log(R), console.log("https://dev-api-tm.labsquire.com/v3.0");
  const s = "https://dev-api-tm.labsquire.com/v3.0/auth/login";
  console.log("https://dev-api-tm.labsquire.com/v3.0");
  const [r, d] = useState(false), [n, a] = useState(""), p = useNavigate(), { register: i, handleSubmit: f, setValue: P, getValues: A, formState: { errors: O } } = useForm(), { mutate: S, isPending: u } = useMutation({ mutationKey: ["login"], mutationFn: async (t) => {
    const o = await fetch(s, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(t) });
    if (!o.ok) throw new Error("Invalid credentials");
    return o.json();
  }, onSuccess: (t) => {
    var _a;
    if ((t == null ? void 0 : t.status) !== 200 || !((_a = t == null ? void 0 : t.data) == null ? void 0 : _a.user_details)) {
      a("Invalid response from server.");
      return;
    }
    const o = t.data.access_token;
    N.set("access_token", o, { expires: 7, secure: false }), I({ user: { email: t.data.user_details.email, token: o, role: t.data.user_details.user_type } }), p({ to: "/projects/project-table" });
  }, onError: (t) => a(t.message) });
  return jsx("div", { className: "flex flex-col items-center justify-center h-screen bg-gray-100", children: jsx("div", { className: "max-w-md w-full bg-white p-6 shadow-lg rounded-lg", children: jsxs("form", { onSubmit: f((t) => {
    a(""), S(t);
  }), className: "flex flex-col space-y-4", children: [jsxs("div", { className: "relative", children: [jsx(Mail, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" }), jsx("input", { type: "email", placeholder: "Email", ...i("email"), className: "w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), jsxs("div", { className: "relative", children: [jsx(LockKeyhole, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" }), jsx("input", { type: r ? "text" : "password", placeholder: "Password", ...i("password"), className: "w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" }), jsx("span", { onClick: () => d(!r), className: "absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600", children: r ? jsx(Eye, {}) : jsx(EyeOff, {}) }), jsx("a", { href: "/forgot-password", className: "block text-blue-500 text-sm mt-2", children: "Forgot Password?" })] }), n && jsx("p", { className: "text-red-500 text-sm", children: n }), jsx("button", { type: "submit", disabled: u, className: "w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition", children: u ? "Logging in..." : "Log In" })] }) }) });
};

export { V };
//# sourceMappingURL=SignIn-C0fgN4Ub.mjs.map
