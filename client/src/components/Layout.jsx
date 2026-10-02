import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui";

export const Logo = ({ light }) => (
  <Link
    to="/"
    className="flex items-center gap-2 font-display text-xl font-extrabold"
  >
    <span className="grid size-8 place-items-center rounded-lg bg-marker text-ink">
      S
    </span>
    <span className={light ? "text-white" : ""}>StudyShare</span>
  </Link>
);

export default function Layout() {
  const { user, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const link = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm font-semibold transition ${isActive ? "bg-ink text-white" : "text-ink/70 hover:bg-ink/5"}`;
  const close = () => setOpen(false);
  const links = user ? (
    <>
      <NavLink to="/resources" className={link} onClick={close}>
        Browse
      </NavLink>
      <NavLink to="/upload" className={link} onClick={close}>
        Upload
      </NavLink>
      <NavLink to="/my-resources" className={link} onClick={close}>
        My uploads
      </NavLink>
      <NavLink to="/profile" className={link} onClick={close}>
        Profile
      </NavLink>
      {isAdmin && (
        <NavLink to="/admin" className={link} onClick={close}>
          Admin
        </NavLink>
      )}
    </>
  ) : null;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-canvas/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">{links}</nav>
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <Button
                variant="ghost"
                onClick={() => {
                  logout();
                  nav("/");
                }}
              >
                Log out
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => nav("/login")}>
                  Log in
                </Button>
                <Button onClick={() => nav("/register")}>Create account</Button>
              </>
            )}
          </div>
          <button
            className="rounded-md p-2 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            aria-expanded={open}
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d={open ? "M5 5l14 14M19 5L5 19" : "M4 7h16M4 12h16M4 17h16"}
              />
            </svg>
          </button>
        </div>
        {open && (
          <div className="flex flex-col gap-1 border-t border-ink/10 px-4 py-3 md:hidden">
            {links}
            {user ? (
              <Button
                variant="ghost"
                onClick={() => {
                  logout();
                  close();
                  nav("/");
                }}
              >
                Log out
              </Button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    close();
                    nav("/login");
                  }}
                >
                  Log in
                </Button>
                <Button
                  onClick={() => {
                    close();
                    nav("/register");
                  }}
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>
        )}
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:py-10">
        <Outlet />
      </main>
      <footer className="bg-ink text-white/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <Logo light />
          <p className="max-w-md text-sm">
            Only upload materials you have permission to share. See something
            that shouldn't be here? Use the report button on any resource.
          </p>
        </div>
      </footer>
    </div>
  );
}
