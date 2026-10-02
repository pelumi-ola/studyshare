import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCatalog } from "../lib/hooks";
import { LEVELS, TYPES } from "../lib/constants";
import ResourceCard from "../components/ResourceCard";
import {
  Button,
  Empty,
  Input,
  Loading,
  PageHead,
  Select,
} from "../components/ui";

const PER = 9;

export default function Resources() {
  const { resources, courses, loading, error } = useCatalog();
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [course, setCourse] = useState("");
  const [dept, setDept] = useState("");
  const [level, setLevel] = useState("");
  const [sort, setSort] = useState("new");
  const [page, setPage] = useState(1);

  const depts = useMemo(
    () => [...new Set(courses.map((c) => c.department))].sort(),
    [courses],
  );
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const out = resources.filter((r) => {
      const c = r.course;
      if (type && r.resourceType !== type) return false;
      if (course && c?._id !== course) return false;
      if (dept && c?.department !== dept) return false;
      if (level && c?.level !== level) return false;
      if (!s) return true;
      return [
        r.title,
        r.description,
        r.fileName,
        c?.courseCode,
        c?.courseTitle,
      ].some((x) => x?.toLowerCase().includes(s));
    });
    return out.sort((a, b) =>
      sort === "popular"
        ? (b.downloadCount || 0) - (a.downloadCount || 0)
        : new Date(b.createdAt) - new Date(a.createdAt),
    );
  }, [resources, q, type, course, dept, level, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER));
  const shown = filtered.slice((page - 1) * PER, page * PER);
  const on = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };
  const active = q || type || course || dept || level;

  return (
    <>
      <PageHead
        title="Browse resources"
        action={
          <Link to="/upload">
            <Button variant="marker">Upload a resource</Button>
          </Link>
        }
      >
        Search by title or course code, then narrow by department, level or
        type.
      </PageHead>
      <div className="mb-6 space-y-3 rounded-2xl bg-white p-4 ring-1 ring-ink/10">
        <Input
          type="search"
          placeholder="Search e.g. CSC301, algorithms, past questions"
          value={q}
          onChange={on(setQ)}
          aria-label="Search resources"
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Select value={type} onChange={on(setType)} aria-label="Type">
            <option value="">All types</option>
            {Object.entries(TYPES).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </Select>
          <Select value={dept} onChange={on(setDept)} aria-label="Department">
            <option value="">All departments</option>
            {depts.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </Select>
          <Select value={level} onChange={on(setLevel)} aria-label="Level">
            <option value="">All levels</option>
            {LEVELS.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </Select>
          <Select value={course} onChange={on(setCourse)} aria-label="Course">
            <option value="">All courses</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.courseCode}
              </option>
            ))}
          </Select>
          <Select value={sort} onChange={on(setSort)} aria-label="Sort">
            <option value="new">Newest first</option>
            <option value="popular">Most downloaded</option>
          </Select>
        </div>
        {active && (
          <button
            className="text-sm font-semibold text-cobalt"
            onClick={() => {
              setQ("");
              setType("");
              setCourse("");
              setDept("");
              setLevel("");
              setPage(1);
            }}
          >
            Clear all filters
          </button>
        )}
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <Empty title="Couldn't load resources">{error}</Empty>
      ) : !shown.length ? (
        <Empty
          title={active ? "Nothing matches those filters" : "No resources yet"}
          action={
            !active && (
              <Link to="/upload">
                <Button>Upload the first one</Button>
              </Link>
            )
          }
        >
          {active
            ? "Try a different keyword or clear a filter."
            : "Be the first to share something for your course."}
        </Empty>
      ) : (
        <>
          <p className="mb-3 text-sm text-ink/60">
            {filtered.length} resource{filtered.length !== 1 && "s"}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((r) => (
              <ResourceCard key={r._id} r={r} />
            ))}
          </div>
          {pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button
                variant="ghost"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span className="text-sm font-medium">
                Page {page} of {pages}
              </span>
              <Button
                variant="ghost"
                disabled={page === pages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
}
