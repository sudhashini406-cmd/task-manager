import type { ReactNode } from "react";
import{Meta,Scripts} from "@tanstack/start"
import appCss from "@/styles/app.css?url" 
import {
  Outlet,
  createRootRoute,
  useRouterState,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
//import { Meta, Scripts } from "@tanstack/react-start";
import React from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
    mutations: {
      retry: 2,
    },
  },
});

// Loading indicator component
const LoadingIndicator = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-100/50">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);
export const Route = createRootRoute({
    head: () => ({
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          title: "TanStack Start Starter",
        },
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
      ],
    }),
    component: RootComponent,
  })

// export const Route = createRootRoute({
//   head: () => ({
//     meta: [
//       {
//         charSet: "utf-8",
//       },
//       {
//         name: "viewport",
//         content: "width=device-width, initial-scale=1",
//       },
//       {
//         title: "Pond Manager",
//       },
//     ],
//    }),
//   component: RootComponent,
// });

function RootComponent() {
  const isLoading = useRouterState({ select: (state) => state.isLoading });

  return (
    <QueryClientProvider client={queryClient}>
      <RootDocument>
        {isLoading && <LoadingIndicator />}
        <Outlet />
      </RootDocument>
      </QueryClientProvider>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <Meta />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

export default RootComponent;