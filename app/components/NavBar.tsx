import { Link } from "@remix-run/react";
export default function NavBar() {
  return (
    <div>
      <Link to={`/`}>Home</Link>
      <Link to="/projects">Projects</Link>
    </div>
  );
}
