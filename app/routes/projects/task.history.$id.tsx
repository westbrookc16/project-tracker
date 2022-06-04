import { getHistory } from "~/models/timeEntry";
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/Node";
import invariant from "tiny-invariant";
import { useLoaderData } from "@remix-run/react";
import { formatDateWithTime } from "~/utils/date";
type LoaderData = { history: Awaited<ReturnType<typeof getHistory>> };
export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.id, "id must be set.");
  const history = await getHistory(parseInt(params.id));
  return json<LoaderData>({ history });
};
export default function History() {
  const { history } = useLoaderData<LoaderData>();
  const trs = history.map((h) => {
    return (
      <tr key={h.id}>
        <td>{h.status}</td>
        <td>{formatDateWithTime(h.startDate)}</td>
        <td>{formatDateWithTime(h.endDate)}</td>
      </tr>
    );
  });
  return (
    <div>
      <h1>View History</h1>
      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>Start Date</th>
            <th>End Date</th>
          </tr>
        </thead>
        {trs}
      </table>
    </div>
  );
}
