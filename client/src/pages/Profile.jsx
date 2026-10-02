import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fmtDate } from "../lib/constants";
import { Badge, Button, PageHead } from "../components/ui";

export default function Profile() {
  const { user, refresh, logout } = useAuth();
  const [fresh, setFresh] = useState(false);
  useEffect(() => {
    refresh().finally(() => setFresh(true)); /* eslint-disable-next-line */
  }, []);
  const rows = [
    ["Email", user.email],
    ["Department", user.department || "Not set"],
    ["Level", user.level ? `${user.level} level` : "Not set"],
    ["Member since", fmtDate(user.createdAt)],
  ];
  return (
    <div className="mx-auto max-w-2xl">
      <PageHead title="Your profile" />
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/10">
        <div className="flex items-center gap-4 bg-ink p-6 text-white">
          <span className="grid size-16 place-items-center rounded-full bg-marker font-display text-2xl font-extrabold text-ink">
            {user.name?.[0]?.toUpperCase()}
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-2xl font-bold">{user.name}</h2>
            <Badge tone="bg-white/15 text-white">{user.role}</Badge>
          </div>
        </div>
        <dl className="divide-y divide-ink/10">
          {rows.map(([k, v]) => (
            <div
              key={k}
              className="flex justify-between gap-4 px-6 py-4 text-sm"
            >
              <dt className="text-ink/55">{k}</dt>
              <dd className="min-w-0 truncate font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-wrap gap-3 p-6 pt-2">
          <Link to="/my-resources">
            <Button>View my uploads</Button>
          </Link>
          <Button variant="ghost" onClick={logout}>
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
}
