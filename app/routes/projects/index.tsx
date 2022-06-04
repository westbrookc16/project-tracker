import { Link } from "@remix-run/react";
import { json } from "@remix-run/node";

import { getProjects } from "~/models/project.server";
import type { LoaderFunction } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { useLoaderData } from "@remix-run/react";
import React from "react";

type LoaderData = { projects: Awaited<ReturnType<typeof getProjects>> };
export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const projects = await getProjects({ userId });
  return json<LoaderData>({ projects });
};
export default function Projects() {
  const { projects } = useLoaderData<LoaderData>();
  return (
    <div>
      <h1>Projects</h1>
      {projects.map((p) => (
        <React.Fragment key={p.id}>
          <h2>
            <Link to={p.id.toString()}>{p.name}</Link>
          </h2>
          <br />
          {p.description}
        </React.Fragment>
      ))}
    </div>
  );
}
