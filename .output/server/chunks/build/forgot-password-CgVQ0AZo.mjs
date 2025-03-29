import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

const N = "https://dev-api-tm.labsquire.com/v3.0/auth/forgot-password", S = () => {
  const [p, r] = useState(""), [h, t] = useState(false), [a, s] = useState(false), [f, l] = useState("Didn't receive an email? Click here to resend"), { register: b, handleSubmit: g, watch: d, formState: { errors: m } } = useForm(), c = useMutation({ mutationKey: ["forgot-password"], mutationFn: async (o) => {
    const u = await fetch(N, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(o) });
    if (!u.ok) throw new Error("Failed to send recovery email");
    return u.json();
  }, onSuccess: () => {
    r("Recovery email sent successfully!");
  }, onError: () => {
    r("Given Email not found in the system. Please check with the admin.");
  }, onSettled: () => {
    s(false), t(true), setTimeout(() => t(false), 5e3);
  } }), w = (o) => {
    if (s(true), !o.email) {
      r("Please enter your email first."), t(true), setTimeout(() => t(false), 5e3), s(false);
      return;
    }
    r(""), c.mutate(o);
  }, x = () => {
    if (s(true), !d("email")) {
      r("Please enter your email first."), t(true), setTimeout(() => {
        t(false), l("Didn't receive an email? Click here to resend");
      }, 5e3), s(false);
      return;
    }
    c.mutate({ email: d("email") }), setTimeout(() => {
      l("Didn't receive an email? Click here to resend");
    }, 5e3);
  };
  return jsxs("div", { className: "max-w-md mx-auto p-6 text-center bg-white rounded-lg shadow-md", children: [jsx("h2", { className: "text-left text-black font-bold text-xl", children: "Forgot Password" }), jsx("p", { className: "text-left text-gray-600", children: "Enter your email address and we\u2019ll send you a recovery link." }), jsxs("form", { onSubmit: g(w), className: "mt-4", children: [jsxs("div", { className: "mb-4 relative", children: [jsx("input", { type: "email", placeholder: "Email", ...b("email", { required: "Email is required", pattern: { value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/, message: "Must be a Gmail address" } }), className: "w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" }), m.email && jsx("p", { className: "text-red-500 text-sm mt-1", children: m.email.message })] }), jsx("button", { type: "submit", disabled: a, className: "w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-2 px-4 rounded font-bold hover:bg-blue-600 disabled:bg-gray-400", children: a ? jsx("span", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }) : "Send recovery email" })] }), jsx("button", { onClick: x, disabled: a, className: "mt-3 text-blue-600 hover:underline disabled:text-gray-400", children: a ? jsx("span", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }) : f }), h && jsx("div", { className: "fixed top-5 right-5 bg-orange-500 text-white p-3 rounded-md shadow-lg font-bold animate-fadeInOut", children: jsx("p", { children: p }) }), jsx("a", { href: "/", className: "block mt-4 text-blue-600 hover:underline", children: "Back to Login" })] });
}, j = S;

export { j as component };
//# sourceMappingURL=forgot-password-CgVQ0AZo.mjs.map
