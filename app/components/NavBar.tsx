import { Form, Link } from "@remix-run/react";
import type { Auth0Profile } from "remix-auth-auth0";
export default function NavBar({ user }: { user: Auth0Profile | null }) {
  return (
    <div>
      <Link to={`/`}>Home</Link>
      {user && (
        <>
          <Link className="="btn-indigo-700" to="/projects">Projects</Link>
          <Form method="post" action="/logout">
            <button type="submit">Log Out</button>
          </Form>
        </>
      )}
      {!user && <Link to="/login">Login</Link>}
    </div>
  );
}
