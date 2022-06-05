import NavBar from "~/components/NavBar";
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import type { LinksFunction, MetaFunction } from "@remix-run/node";

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/app.css";
import type { Auth0Profile } from "remix-auth-auth0";
import { auth } from "./utils/auth.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1",
});
type LoaderData = { user: Auth0Profile | null };
export const loader: LoaderFunction = async ({ request }) => {
  const user = await auth.isAuthenticated(request);
  return json<LoaderData>({ user });
};

export default function App() {
  const { user } = useLoaderData<LoaderData>();
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <NavBar user={user} />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
