import { Form } from "@remix-run/react";
import { auth } from "~/utils/auth.server";
import type { ActionFunction } from "@remix-run/node";
import { createProject } from "~/models/project.server";
import invariant from "tiny-invariant";

import { redirect } from "@remix-run/node";
export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();
  const name = data.get("name");
  const description = data.get("description");
  const userId = (
    await auth.isAuthenticated(request, { failureRedirect: "/login" })
  ).id;
  invariant(typeof name === "string", "name must be a string");
  invariant(typeof description === "string", "description must be a string");
  const project = await createProject({ name, description, userId });
  return redirect(`/projects/${project.id}`);
};
export default function New() {
  return (
    <Form method="post">
      <label htmlFor="name">Name</label>
      <input type="text" required name="name" id="name" />
      <label htmlFor="description">Description</label>
      <input type="text" required name="description" id="description" />

      <button type="submit">Add</button>
    </Form>
  );
}
