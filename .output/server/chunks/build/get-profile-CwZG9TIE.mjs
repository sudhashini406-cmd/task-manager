import { jsx, jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import x from 'js-cookie';
import { ArrowLeft, Pencil } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from '@tanstack/react-router';

const U = "https://dev-api-tm.labsquire.com/v3.0/files/upload?is_public=true", T = "https://dev-api-tm.labsquire.com/v3.0/users/11/profile-pic", A = () => {
  const i = useQueryClient(), [a, n] = useState(""), [y, m] = useState(false), p = async (r) => {
    const t = x.get("access_token"), u = `Bearer ${t}`;
    if (!t) throw new Error("Authentication error: Please log in again.");
    m(true);
    try {
      const d = await fetch(U, { method: "POST", headers: { Authorization: u, "Content-Type": "application/json" }, body: JSON.stringify({ file_name: r.name, file_type: r.type }) });
      if (!d.ok) throw new Error("Error fetching upload URL: ${getUrlResponse.statusText}");
      const { data: s } = await d.json(), h = s.target_url, c = s.file_key;
      if (console.log(h), !(await fetch(h, { method: "PUT", body: r, headers: { "Content-Type": r.type } })).ok) throw new Error("Error uploading file to S3: ${s3UploadResponse.statusText}");
      return c;
    } finally {
      m(false);
    }
  }, l = useMutation({ mutationFn: async (r) => {
    const t = await p(r), u = x.get("access_token");
    console.log(u);
    const d = `Bearer ${u}`, s = await fetch(T, { method: "PATCH", headers: { Authorization: d, "Content-Type": "application/json" }, body: JSON.stringify({ profile_pic: t }) });
    if (!s.ok) throw new Error("Error updating profile picture: ${updateResponse.statusText}");
    return s.json();
  }, onSuccess: () => {
    i.invalidateQueries({ queryKey: ["profile"] }), n("");
  }, onError: (r) => {
    n(r.message);
  } });
  return jsx("div", { className: "relative", children: jsxs("label", { className: "absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer", children: [jsx(Pencil, { className: "w-5 h-5 text-gray-600" }), jsx("input", { type: "file", className: "hidden", accept: "image/", onChange: (r) => {
    var _a;
    const t = (_a = r.target.files) == null ? void 0 : _a[0];
    t && l.mutate(t);
  } })] }) });
}, v = "https://dev-api-tm.labsquire.com/v3.0/users/11", S = async () => {
  const i = x.get("access_token");
  if (!i) throw new Error("No token found. Please log in again.");
  const a = await fetch(v, { method: "GET", headers: { Authorization: `Bearer ${i}`, Accept: "application/json" } });
  if (!a.ok) throw new Error(`Error ${a.status}: ${a.statusText}`);
  return a.json();
}, j = async (i) => {
  const a = x.get("access_token");
  if (!a) throw new Error("No token found. Please log in again.");
  const n = await fetch(v, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${a}` }, body: JSON.stringify(i) });
  if (!n.ok) throw new Error(`Error ${n.status}: ${n.statusText}`);
  return n.json();
}, F = () => {
  const i = useNavigate(), { data: a, error: n, isLoading: y } = useQuery({ queryKey: ["profile"], queryFn: S }), [m, p] = useState(false), [l, b] = useState({}), r = useMutation({ mutationFn: j, onSuccess: () => {
    p(false), toast.success("Profile updated successfully!", { position: "top-right", autoClose: 3e3 });
  }, onError: (c) => {
    console.error("Update failed:", c), toast.error("Failed to update profile!", { position: "top-right", autoClose: 3e3 });
  } }), t = a == null ? void 0 : a.data, d = t && t.profile_pic ? `https://labsquire-tm-assets.s3.us-east-1.amazonaws.com/${t.profile_pic}` : "/default-avatar.png", s = (c) => {
    b({ ...l, [c.target.name]: c.target.value });
  }, h = (c) => {
    c.preventDefault(), r.mutate(l);
  };
  return y ? jsx("p", { children: "Loading profile..." }) : n ? jsx("p", { className: "text-red-500", children: n.message }) : t ? jsxs("div", { className: "p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md", children: [jsx(ToastContainer, {}), jsxs("div", { className: "flex justify-between items-center mb-4", children: [jsx("h2", { className: "text-2xl font-semibold", children: "Profile Information" }), m ? jsxs("div", { className: "flex gap-2", children: [jsx("button", { onClick: () => p(false), className: "px-4 py-1 bg-gray-300 rounded", children: "Cancel" }), jsx("button", { onClick: h, className: "px-4 py-1 bg-green-500 text-white rounded", children: r.isPending ? "Saving..." : "Save" })] }) : jsx("button", { onClick: () => {
    p(true), b(t);
  }, className: "px-4 py-1 bg-blue-500 text-white rounded", children: "Edit" })] }), jsx("hr", { className: "border-t-2 border-gray-300 mb-4" }), jsxs("div", { className: "flex items-center gap-4 mb-6 relative", children: [jsx("img", { src: d, alt: "Profile", className: "w-20 h-20 rounded-full shadow" }), jsx(A, {}), jsxs("h3", { className: "text-xl font-semibold", children: [t.fname, " ", t.lname] })] }), jsx("h3", { className: "text-lg font-semibold mb-2", children: "Personal Information" }), jsx("hr", { className: "my-4 border-t-2 border-gray-300" }), m ? jsx("form", { onSubmit: h, className: "space-y-4", children: jsxs("div", { className: "grid grid-cols-2 gap-4", children: [jsxs("div", { children: [jsx("label", { className: "block text-sm font-medium", children: "First Name" }), jsx("input", { type: "text", name: "fname", value: l.fname || "", onChange: s, className: "mt-1 block w-full p-2 border border-gray-300 rounded" })] }), jsxs("div", { children: [jsx("label", { className: "block text-sm font-medium", children: "Last Name" }), jsx("input", { type: "text", name: "lname", value: l.lname || "", onChange: s, className: "mt-1 block w-full p-2 border border-gray-300 rounded" })] }), jsxs("div", { children: [jsx("label", { className: "block text-sm font-medium", children: "Email" }), jsx("input", { type: "email", name: "email", value: l.email || "", onChange: s, className: "mt-1 block w-full p-2 border border-gray-300 rounded" })] }), jsxs("div", { children: [jsx("label", { className: "block text-sm font-medium", children: "Phone Number" }), jsx("input", { type: "text", name: "phone_number", value: l.phone_number || "", onChange: s, className: "mt-1 block w-full p-2 border border-gray-300 rounded" })] })] }) }) : jsxs("div", { className: "grid grid-cols-2 gap-4", children: [jsxs("p", { children: [jsx("strong", { children: "First Name:" }), " ", t.fname] }), jsxs("p", { children: [jsx("strong", { children: "Last Name:" }), " ", t.lname] }), jsxs("p", { children: [jsx("strong", { children: "Email:" }), " ", t.email] }), jsxs("p", { children: [jsx("strong", { children: "Phone Number:" }), " ", t.phone_number] })] }), jsxs("div", { children: [jsx("strong", { children: "User Type" }), jsx("div", { children: t.user_type })] }), jsx("div", { children: jsxs("button", { onClick: () => i({ to: "/projects/project-table" }), className: `flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 \r
             text-black font-semibold rounded-md shadow-md transition duration-200`, children: [jsx(ArrowLeft, { size: 18 }), " Go Back"] }) })] }) : jsx("p", { children: "No profile data available." });
}, D = F;

export { D as component };
//# sourceMappingURL=get-profile-CwZG9TIE.mjs.map
