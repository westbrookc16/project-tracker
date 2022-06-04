import { Link, Outlet } from "@remix-run/react";
export default function Layout() {
  return (
    <div>
      <Link to="new">Enter New Project</Link>
      <Outlet />
    </div>
  );
}
