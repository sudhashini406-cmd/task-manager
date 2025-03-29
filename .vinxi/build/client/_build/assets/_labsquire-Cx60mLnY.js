import{r as o,u as p,a as y,j as e,O as g}from"./client-CEzPjcs2.js";import{c as r}from"./createLucideIcon-xFbQuUs1.js";/**
 * @license lucide-react v0.484.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M16 12H8",key:"1fr5h0"}],["path",{d:"m12 8-4 4 4 4",key:"15vm53"}]],k=r("circle-arrow-left",m);/**
 * @license lucide-react v0.484.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}],["path",{d:"M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662",key:"154egf"}]],d=r("circle-user",f);/**
 * @license lucide-react v0.484.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["path",{d:"M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",key:"1s6t7t"}],["circle",{cx:"16.5",cy:"7.5",r:".5",fill:"currentColor",key:"w0ekpg"}]],j=r("key-round",b);/**
 * @license lucide-react v0.484.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]],w=r("layout-dashboard",v);/**
 * @license lucide-react v0.484.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=[["path",{d:"m3 17 2 2 4-4",key:"1jhpwq"}],["path",{d:"m3 7 2 2 4-4",key:"1obspn"}],["path",{d:"M13 6h8",key:"15sg57"}],["path",{d:"M13 12h8",key:"h98zly"}],["path",{d:"M13 18h8",key:"oe0vm4"}]],S=r("list-checks",N);/**
 * @license lucide-react v0.484.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=[["rect",{x:"16",y:"16",width:"6",height:"6",rx:"1",key:"4q2zg0"}],["rect",{x:"2",y:"16",width:"6",height:"6",rx:"1",key:"8cvhb9"}],["rect",{x:"9",y:"2",width:"6",height:"6",rx:"1",key:"1egb70"}],["path",{d:"M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3",key:"1jsf9p"}],["path",{d:"M12 12V8",key:"2874zd"}]],_=r("network",C);/**
 * @license lucide-react v0.484.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]],M=r("users",z);function L(){const[l,c]=o.useState(!1),[h,i]=o.useState(!1),[x,a]=o.useState(null);p();const t=y(),u="Sudhashini";return o.useEffect(()=>{const n=localStorage.getItem("authState");if(n)try{const s=JSON.parse(n);console.log("Stored authState in localStorage:",s),s&&s.user&&s.user.role?a(s.user.role):(console.warn("Role not found in authState, defaulting to user"),a("user"))}catch(s){console.error("Error parsing authState object:",s),a("user")}else console.warn("No authState found in localStorage, defaulting to user"),a("user")},[]),o.useEffect(()=>{localStorage.getItem("loginSuccess")==="true"&&(i(!0),setTimeout(()=>{i(!1),localStorage.removeItem("loginSuccess")},3e3))},[]),e.jsxs("div",{className:"flex h-screen",children:[e.jsxs("aside",{className:"w-1/5 bg-white p-6 border-r-2 border-gray-300 left-0 top-0",children:[e.jsx("div",{className:"flex justify-center mb-6",children:e.jsx("img",{src:"/lab.jpg",alt:"Logo",className:"w-500 h-40 rounded-full"})}),e.jsxs("button",{className:"flex items-center gap-3 px-4 py-2 text-black hover:text-sky-500",onClick:()=>t({to:"/reset-password"}),children:[e.jsx(w,{size:20}),"Dashboard"]}),e.jsxs("button",{className:"flex items-center gap-3 px-4 py-2 text-black hover:text-sky-500",onClick:()=>t({to:"/projects/project-table"}),children:[e.jsx(_,{size:20}),"Projects"]}),e.jsxs("button",{className:"flex items-center gap-3 px-4 py-2 text-black hover:text-sky-500",onClick:()=>t({to:"/tasks/get-task-stats"}),children:[e.jsx(S,{size:20}),"Tasks"]}),x==="admin"&&e.jsxs("button",{className:"flex items-center gap-3 px-4 py-2 text-black hover:text-sky-500",onClick:()=>t({to:"/users/user-table"}),children:[e.jsx(M,{size:20}),"Users"]})]}),e.jsxs("div",{className:"flex flex-col flex-1",children:[e.jsx("nav",{className:"bg-white p-4 border-b border-gray-300 flex justify-end items-center relative",children:e.jsxs("div",{className:"relative",children:[e.jsx("button",{onClick:()=>t({to:"/tasks/add-tasks"}),children:"+Add Task"}),e.jsxs("button",{onClick:()=>c(!l),className:"flex items-center gap-2 font-semibold text-gray-700 hover:text-gray-900",children:[e.jsx(d,{size:24}),u]}),l&&e.jsx("div",{className:"absolute top-10 right-0 bg-white shadow-lg rounded-md w-48 z-10 border border-gray-200",children:e.jsxs("ul",{className:"list-none p-0 m-0",children:[e.jsxs("li",{onClick:()=>{t({to:"/get-profile"}),c(!1)},className:"flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100",children:[e.jsx(d,{size:18}),"View Profile"]}),e.jsxs("li",{onClick:()=>{t({to:"/update-password"}),c(!1)},className:"flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100",children:[e.jsx(j,{size:18}),"Update Password"]}),e.jsxs("li",{onClick:()=>{localStorage.clear(),t({to:"/sign-in"})},className:"flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 text-red-500",children:[e.jsx(k,{size:18}),"Logout"]})]})})]})}),e.jsx("main",{className:"flex-1 p-6 border border-gray-300 m-6 rounded-md",children:e.jsx(g,{})})]}),h&&e.jsx("div",{className:"fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-md shadow-md font-semibold",children:"Login Successful!"})]})}const E=L;export{E as component};
