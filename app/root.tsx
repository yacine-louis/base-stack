import {
  href,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches,
  useRevalidator,
  type EntryContext,
} from "react-router";

import type { Route } from "./+types/root";
import "./styles/app.css";
import fontStyleSheetUrl from "./styles/font.css?url&no-inline";
import React from "react";
import { useRefetchOnWindowFocus } from "./hooks/useRefetchOnWindowFocus";
import { GeneralErrorBoundary } from "./components/errors";
export const links: Route.LinksFunction = () => [
  // handling favicon
  { rel: "icon", type: "image/x-icon", href: "/favicon.ico", sizes: "32x32" },
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
  { rel: "manifest", href: "/manifest.webmanifest" },

  // fonts
  {
    rel: "stylesheet",
    href: fontStyleSheetUrl,
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <script src="/auto.global.js" async />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/* __refetch on window focus__ */
declare global {
  interface Window {
    __reactRouterManifest: EntryContext["manifest"] | undefined;
  }
}
/* __refetch on window focus__ */

export default function App() {
  /* __refetch on window focus__ */
  const matches = useMatches();
  const revalidator = useRevalidator();

  useRefetchOnWindowFocus(() => {
    const manifestRoutes = window.__reactRouterManifest?.routes;
    if (!manifestRoutes) return;

    const anyMatchHasLoader = matches.some((m) => {
      const routeInfo = manifestRoutes[m.id];
      return Boolean(routeInfo?.hasLoader || routeInfo?.hasClientLoader);
    });

    if (anyMatchHasLoader) {
      revalidator.revalidate();
    }
  });

  /* __refetch on window focus__ */

  return (
    <div>
      <nav className="bg-muted w-full">
        <ul className="mx-auto flex max-w-250 items-center justify-between px-4 py-4">
          <li className="text-muted-foreground">
            <Link to={href("/")}>Home</Link>
          </li>
          <li>
            <Link to={href("/users")}>users</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <GeneralErrorBoundary error={error} />;
}
