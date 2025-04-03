// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import { RouterProvider, createRouter } from '@tanstack/react-router'


// import { routeTree } from './routeTree.gen'
// import "./main.css"
// // Set up a Router instance
// const router = createRouter({
//   routeTree,
//   defaultPreload: 'intent',
// })

// // Register things for typesafety
// declare module '@tanstack/react-router' {
//   interface Register {
//     router: typeof router
//   }
// }


// const rootElement = document.getElementById('app')!

// if (!rootElement.innerHTML) {
//   const root = ReactDOM.createRoot(rootElement)
//   root.render(<RouterProvider router={router} />)
// }
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";
import "./main.css";

// Fix SSR warning by overriding useLayoutEffect on the server
if (typeof window === "undefined") {
  React.useLayoutEffect = React.useEffect;
}

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

// Register things for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<RouterProvider router={router} />);
}
