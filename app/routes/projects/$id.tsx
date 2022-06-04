import { Link } from "@remix-run/react";
import { createTask } from "~/models/task.server";
import { getProject } from "~/models/project.server";
import { useLoaderData, useTransition } from "@remix-run/react";
import { getTasksByProject } from "~/models/task.server";
import { Form } from "@remix-run/react";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { formatDateWithoutTime } from "~/utils/date";
import { setStart, setStatusWithEndTime } from "~/models/timeEntry";
type LoaderData = {
  project: Awaited<ReturnType<typeof getProject>>;
  tasks: Awaited<ReturnType<typeof getTasksByProject>>;
};
export const action: ActionFunction = async ({ request, params }) => {
  const data = await request.formData();
  const _action = data.get("_action");
  if (_action === "New") {
    const name = data.get("name");
    const description = data.get("description");
    const dueDate = data.get("dueDate");

    invariant(name && typeof name === "string", "Name must be defined");
    invariant(
      description && typeof description === "string",
      "description must be defined."
    );
    invariant(
      dueDate && typeof dueDate === "string",
      "Due date must be defined."
    );
    invariant(params.id, "param is missing.");
    const projectId = parseInt(params.id);
    await createTask({
      name,
      description,
      dueDate: new Date(dueDate),
      projectId,
    });
  } else {
    const taskId = data.get("taskId");
    invariant(taskId && typeof taskId === "string", "task must be set.");
    invariant(_action && typeof _action === "string", "_action must be set.");
    if (_action === "Start") {
      setStart(parseInt(taskId));
    } else {
      setStatusWithEndTime(_action, parseInt(taskId));
    }
  }
  return null;
};
export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.id, "ID is required");
  const project = await getProject({ id: parseInt(params.id) });
  const tasks = await getTasksByProject({ projectId: parseInt(params.id) });
  return json<LoaderData>({ project, tasks });
};
export default function Project() {
  const { project, tasks } = useLoaderData<LoaderData>();
  const transition = useTransition();
  return (
    <div>
      <h1>Project {project?.name}</h1>
      {project?.description}
      {tasks.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Start</th>
              <th>On Hold</th>
              <th>Complete</th>
              <th>View History</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => {
              return (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td>{t.description}</td>
                  <td>{formatDateWithoutTime(t.dueDate)}</td>
                  <td>{t.status}</td>
                  <td>
                    <button
                      type="submit"
                      disabled={
                        transition.state !== "idle" || t.status === "Started"
                      }
                      name="_action"
                      value="Start"
                      form={`task-${t.id}`}
                    >
                      Start
                    </button>
                  </td>

                  <td>
                    <button
                      type="submit"
                      disabled={
                        transition.state !== "idle" ||
                        t.status === "On Hold" ||
                        t.status === "Complete" ||
                        t.status === "Not Started"
                      }
                      name="_action"
                      value="On Hold"
                      form={`task-${t.id}`}
                    >
                      ON Hold
                    </button>
                  </td>
                  <td>
                    <button
                      type="submit"
                      disabled={
                        transition.state !== "idle" ||
                        t.status === "Not Started" ||
                        t.status === "Complete"
                      }
                      name="_action"
                      value="Complete"
                      form={`task-${t.id}`}
                    >
                      Complete
                    </button>
                  </td>
                  <td>
                    <Link to={`/projects/task/history/${t.id}`}>
                      View History
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {tasks.map((t) => {
        return (
          <Form id={`task-${t.id}`} key={t.id} method="post">
            <input type="hidden" name="taskId" value={t.id} />
          </Form>
        );
      })}
      <h2>Add Task</h2>
      <Form method="post" id="addTask">
        <label htmlFor="name">Name</label>
        <input type="text" name="name" id="name" required />

        <label htmlFor="description">Description</label>
        <input type="text" name="description" id="description" required />

        <label htmlFor="dueDate">Due Date (mm/dd/yyyy)</label>
        <input type="text" name="dueDate" id="dueDate" required />
        <button type="submit" name="_action" value="New">
          Add Task
        </button>
      </Form>
    </div>
  );
}
