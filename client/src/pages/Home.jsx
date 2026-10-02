import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { TYPES } from "../lib/constants";
import { Button } from "../components/ui";

const stack = [
  {
    code: "CSC301",
    t: "Algorithms past questions",
    type: "past-question",
    r0: "-8deg",
    r1: "-5deg",
    cls: "left-0 top-6",
  },
  {
    code: "MTH201",
    t: "Linear algebra summary",
    type: "course-summary",
    r0: "6deg",
    r1: "3deg",
    cls: "right-0 top-0",
  },
  {
    code: "GST111",
    t: "Use of English lecture notes",
    type: "lecture-note",
    r0: "-2deg",
    r1: "0deg",
    cls: "left-6 top-40 sm:left-10",
  },
];

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="space-y-20 sm:space-y-28">
      <section className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <h1 className="text-5xl font-extrabold leading-[1.02] sm:text-6xl">
            Stop scrolling through group chats for that one past question.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-ink/70">
            StudyShare keeps lecture notes, past questions and study guides in
            one place, sorted by course and level, so you can find what you need
            before your next class.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={user ? "/resources" : "/register"}>
              <Button variant="marker" className="px-6 py-3 text-base">
                {user ? "Browse resources" : "Create a free account"}
              </Button>
            </Link>
            {!user && (
              <Link to="/login">
                <Button variant="ghost" className="px-6 py-3 text-base">
                  I already have an account
                </Button>
              </Link>
            )}
          </div>
        </div>
        <div
          className="relative mx-auto h-80 w-full max-w-md sm:h-96"
          aria-hidden="true"
        >
          {stack.map((c, i) => (
            <div
              key={c.code}
              className={`settle absolute w-64 rounded-xl bg-white p-4 shadow-xl ring-1 ring-ink/10 sm:w-72 ${c.cls}`}
              style={{
                "--r0": c.r0,
                "--r1": c.r1,
                animationDelay: `${i * 120}ms`,
              }}
            >
              <div
                className={`-mx-4 -mt-4 mb-3 h-2 rounded-t-xl ${TYPES[c.type].bar}`}
              />
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-semibold ${TYPES[c.type].tone}`}
                >
                  {TYPES[c.type].label}
                </span>
                <span className="font-display font-bold text-ink/70">
                  {c.code}
                </span>
              </div>
              <p className="mt-3 font-display text-lg font-bold">{c.t}</p>
              <p className="mt-1 text-xs text-ink/50">PDF · 1.2 MB</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="max-w-xl text-3xl font-extrabold sm:text-4xl">
          Everything students pass around, filed where you can find it
        </h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(TYPES)
            .filter(([k]) => k !== "other")
            .map(([k, v]) => (
              <Link
                key={k}
                to={user ? "/resources" : "/login"}
                className="flex items-center gap-4 rounded-xl bg-white p-5 ring-1 ring-ink/10 transition hover:ring-cobalt/50"
              >
                <span className={`h-12 w-1.5 rounded-full ${v.bar}`} />
                <span className="font-display text-xl font-bold">
                  {v.label}s
                </span>
              </Link>
            ))}
        </div>
      </section>

      <section className="rounded-3xl bg-ink p-8 text-white sm:p-12">
        <h2 className="max-w-lg text-3xl font-extrabold sm:text-4xl">
          Share what helped you
        </h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            [
              "Pick the course",
              "Choose the course code and resource type so others can find it.",
            ],
            [
              "Upload a PDF",
              "Add a clear title and description. Confirm you're allowed to share it.",
            ],
            [
              "Help your coursemates",
              "Your upload shows up in search for everyone on your course.",
            ],
          ].map(([h, p], i) => (
            <li key={h}>
              <span className="grid size-8 place-items-center rounded-full bg-marker font-display font-bold text-ink">
                {i + 1}
              </span>
              <h3 className="mt-3 text-lg font-bold">{h}</h3>
              <p className="mt-1 text-sm text-white/70">{p}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
