import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, asList, idOf } from "../lib/api";
import { useCatalog } from "../lib/hooks";
import { LEVELS, REPORT_STATUS, fmtDate } from "../lib/constants";
import {
  Badge,
  Button,
  Empty,
  Field,
  Input,
  Loading,
  Modal,
  PageHead,
  Select,
  useToast,
} from "../components/ui";

const TABS = ["Overview", "Reports", "Courses", "Resources", "Users"];
const statusTone = {
  pending: "bg-amber-100 text-amber-900",
  reviewed: "bg-blue-100 text-blue-800",
  resolved: "bg-emerald-100 text-emerald-800",
  dismissed: "bg-slate-200 text-slate-700",
};

function Confirm({ item, onClose, onYes, text }) {
  const [busy, setBusy] = useState(false);
  return (
    <Modal open={!!item} onClose={onClose} title="Are you sure?">
      <p className="text-sm text-ink/70">{text}</p>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          loading={busy}
          onClick={async () => {
            setBusy(true);
            await onYes();
            setBusy(false);
          }}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
}

const Table = ({ head, children }) => (
  <div className="overflow-x-auto rounded-xl bg-white ring-1 ring-ink/10">
    <table className="w-full min-w-[640px] text-left text-sm">
      <thead className="bg-ink/5 text-ink/60">
        <tr>
          {head.map((h) => (
            <th key={h} className="px-4 py-3 font-semibold">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-ink/10">{children}</tbody>
    </table>
  </div>
);

export default function Admin() {
  const [tab, setTab] = useState("Overview");
  const cat = useCatalog();
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [busy, setBusy] = useState(true);
  const toast = useToast();

  const loadAdmin = useCallback(async () => {
    const [u, r] = await Promise.allSettled([api.users(), api.reports()]);
    if (u.status === "fulfilled") setUsers(asList(u.value, "users"));
    if (r.status === "fulfilled") setReports(asList(r.value, "reports"));
    setBusy(false);
  }, []);
  useEffect(() => {
    loadAdmin();
  }, [loadAdmin]);

  const act = async (fn, msg, after) => {
    try {
      await fn();
      toast(msg);
      await after();
      return true;
    } catch (e) {
      toast(e.message, "err");
      return false;
    }
  };
  const res = cat.resources,
    courses = cat.courses;
  const pending = reports.filter((r) => r.status === "pending").length;

  return (
    <>
      <PageHead title="Admin dashboard">
        Moderate reports, manage courses, and keep the library clean.
      </PageHead>
      <div
        className="mb-6 flex gap-1 overflow-x-auto rounded-xl bg-ink/5 p-1"
        role="tablist"
      >
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition ${tab === t ? "bg-white shadow-sm" : "text-ink/60 hover:text-ink"}`}
          >
            {t}
            {t === "Reports" && pending > 0 && (
              <span className="ml-2 rounded-full bg-rose-600 px-1.5 py-0.5 text-xs text-white">
                {pending}
              </span>
            )}
          </button>
        ))}
      </div>
      {busy || cat.loading ? (
        <Loading />
      ) : (
        <>
          {tab === "Overview" && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Resources", res.length],
                ["Courses", courses.length],
                ["Users", users.length],
                ["Pending reports", pending],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="rounded-xl bg-white p-5 ring-1 ring-ink/10"
                >
                  <p className="font-display text-4xl font-extrabold">{v}</p>
                  <p className="mt-1 text-sm text-ink/60">{k}</p>
                </div>
              ))}
            </div>
          )}
          {tab === "Reports" && (
            <Reports reports={reports} act={act} reload={loadAdmin} />
          )}
          {tab === "Courses" && (
            <Courses courses={courses} act={act} reload={cat.reload} />
          )}
          {tab === "Resources" && (
            <AdminResources resources={res} act={act} reload={cat.reload} />
          )}
          {tab === "Users" && (
            <Users users={users} act={act} reload={loadAdmin} />
          )}
        </>
      )}
    </>
  );
}

function Reports({ reports, act, reload }) {
  const [open, setOpen] = useState(null);
  const [del, setDel] = useState(null);
  const [detail, setDetail] = useState(null);
  const view = async (r) => {
    setOpen(r);
    try {
      const d = await api.report(r._id);
      setDetail(d?.report || d?.data || d);
    } catch {
      setDetail(r);
    }
  };
  if (!reports.length)
    return (
      <Empty title="No reports">
        Nothing has been flagged. Reports from students will show up here.
      </Empty>
    );
  const res = (r) => (typeof r.resource === "object" ? r.resource : null);
  return (
    <>
      <Table head={["Resource", "Reason", "Status", "Reported", "Actions"]}>
        {reports.map((r) => (
          <tr key={r._id}>
            <td className="px-4 py-3 font-medium">
              {res(r) ? (
                <Link
                  className="text-cobalt hover:underline"
                  to={`/resources/${res(r)._id}`}
                >
                  {res(r).title}
                </Link>
              ) : (
                "Resource"
              )}
            </td>
            <td className="px-4 py-3">{r.reason}</td>
            <td className="px-4 py-3">
              <Select
                value={r.status}
                className="!py-1.5"
                aria-label="Report status"
                onChange={(e) =>
                  act(
                    () => api.updateReport(r._id, { status: e.target.value }),
                    `Marked ${e.target.value}`,
                    reload,
                  )
                }
              >
                {REPORT_STATUS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
            </td>
            <td className="px-4 py-3 text-ink/60">{fmtDate(r.createdAt)}</td>
            <td className="space-x-2 px-4 py-3 whitespace-nowrap">
              <Button
                variant="soft"
                className="!px-3 !py-1.5"
                onClick={() => view(r)}
              >
                Details
              </Button>
              <Button
                variant="soft"
                className="!px-3 !py-1.5 text-rose-700"
                onClick={() => setDel(r)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </Table>
      <Modal
        open={!!open}
        onClose={() => {
          setOpen(null);
          setDetail(null);
        }}
        title="Report details"
      >
        {detail && (
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-ink/55">Reason</dt>
              <dd className="font-semibold">{detail.reason}</dd>
            </div>
            <div>
              <dt className="text-ink/55">Description</dt>
              <dd>{detail.description || "No details given"}</dd>
            </div>
            <div>
              <dt className="text-ink/55">Reported by</dt>
              <dd>{detail.user?.name || idOf(detail.user)}</dd>
            </div>
            <div>
              <dt className="text-ink/55">Status</dt>
              <dd>
                <Badge tone={statusTone[detail.status]}>{detail.status}</Badge>
              </dd>
            </div>
          </dl>
        )}
      </Modal>
      <Confirm
        item={del}
        onClose={() => setDel(null)}
        text="This report will be permanently removed."
        onYes={async () => {
          if (
            await act(() => api.deleteReport(del._id), "Report deleted", reload)
          )
            setDel(null);
        }}
      />
    </>
  );
}

function Courses({ courses, act, reload }) {
  const blank = {
    courseCode: "",
    courseTitle: "",
    department: "",
    level: "100",
  };
  const [form, setForm] = useState(null);
  const [del, setDel] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    const { _id, ...body } = form;
    if (
      await act(
        () => (_id ? api.updateCourse(_id, body) : api.createCourse(body)),
        _id ? "Course updated" : "Course added",
        reload,
      )
    )
      setForm(null);
    setBusy(false);
  };
  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setForm(blank)}>Add course</Button>
      </div>
      {!courses.length ? (
        <Empty title="No courses yet">
          Students can't upload until at least one course exists.
        </Empty>
      ) : (
        <Table head={["Code", "Title", "Department", "Level", "Actions"]}>
          {courses.map((c) => (
            <tr key={c._id}>
              <td className="px-4 py-3 font-display font-bold">
                {c.courseCode}
              </td>
              <td className="px-4 py-3">{c.courseTitle}</td>
              <td className="px-4 py-3">{c.department}</td>
              <td className="px-4 py-3">{c.level}</td>
              <td className="space-x-2 px-4 py-3 whitespace-nowrap">
                <Button
                  variant="soft"
                  className="!px-3 !py-1.5"
                  onClick={() => setForm(c)}
                >
                  Edit
                </Button>
                <Button
                  variant="soft"
                  className="!px-3 !py-1.5 text-rose-700"
                  onClick={() => setDel(c)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      )}
      <Modal
        open={!!form}
        onClose={() => setForm(null)}
        title={form?._id ? "Edit course" : "Add course"}
      >
        {form && (
          <form onSubmit={save} className="space-y-4">
            <Field label="Course code">
              <Input
                required
                value={form.courseCode}
                onChange={set("courseCode")}
                placeholder="CSC301"
              />
            </Field>
            <Field label="Course title">
              <Input
                required
                value={form.courseTitle}
                onChange={set("courseTitle")}
              />
            </Field>
            <Field label="Department">
              <Input
                required
                value={form.department}
                onChange={set("department")}
              />
            </Field>
            <Field label="Level">
              <Select value={form.level} onChange={set("level")}>
                {LEVELS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </Select>
            </Field>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setForm(null)}
              >
                Cancel
              </Button>
              <Button loading={busy}>Save course</Button>
            </div>
          </form>
        )}
      </Modal>
      <Confirm
        item={del}
        onClose={() => setDel(null)}
        text={`Delete ${del?.courseCode}? Resources tied to this course may lose their course.`}
        onYes={async () => {
          if (
            await act(() => api.deleteCourse(del._id), "Course deleted", reload)
          )
            setDel(null);
        }}
      />
    </>
  );
}

function AdminResources({ resources, act, reload }) {
  const [del, setDel] = useState(null);
  if (!resources.length) return <Empty title="No resources uploaded yet" />;
  return (
    <>
      <Table head={["Title", "Course", "Downloads", "Added", "Actions"]}>
        {resources.map((r) => (
          <tr key={r._id}>
            <td className="px-4 py-3 font-medium">
              <Link
                className="text-cobalt hover:underline"
                to={`/resources/${r._id}`}
              >
                {r.title}
              </Link>
            </td>
            <td className="px-4 py-3">{r.course?.courseCode || "—"}</td>
            <td className="px-4 py-3">{r.downloadCount || 0}</td>
            <td className="px-4 py-3 text-ink/60">{fmtDate(r.createdAt)}</td>
            <td className="px-4 py-3">
              <Button
                variant="soft"
                className="!px-3 !py-1.5 text-rose-700"
                onClick={() => setDel(r)}
              >
                Remove
              </Button>
            </td>
          </tr>
        ))}
      </Table>
      <Confirm
        item={del}
        onClose={() => setDel(null)}
        text={`Remove "${del?.title}" from StudyShare?`}
        onYes={async () => {
          if (
            await act(
              () => api.deleteResource(del._id),
              "Resource removed",
              reload,
            )
          )
            setDel(null);
        }}
      />
    </>
  );
}

function Users({ users, act, reload }) {
  const [del, setDel] = useState(null);
  if (!users.length) return <Empty title="No users found" />;
  return (
    <>
      <Table head={["Name", "Email", "Department", "Role", "Joined", ""]}>
        {users.map((u) => (
          <tr key={u._id}>
            <td className="px-4 py-3 font-medium">{u.name}</td>
            <td className="px-4 py-3">{u.email}</td>
            <td className="px-4 py-3">{u.department || "—"}</td>
            <td className="px-4 py-3">
              <Badge
                tone={u.role === "admin" ? "bg-marker text-ink" : undefined}
              >
                {u.role}
              </Badge>
            </td>
            <td className="px-4 py-3 text-ink/60">{fmtDate(u.createdAt)}</td>
            <td className="px-4 py-3">
              {u.role !== "admin" && (
                <Button
                  variant="soft"
                  className="!px-3 !py-1.5 text-rose-700"
                  onClick={() => setDel(u)}
                >
                  Delete
                </Button>
              )}
            </td>
          </tr>
        ))}
      </Table>
      <Confirm
        item={del}
        onClose={() => setDel(null)}
        text={`Delete ${del?.name}'s account?`}
        onYes={async () => {
          if (await act(() => api.deleteUser(del._id), "User deleted", reload))
            setDel(null);
        }}
      />
    </>
  );
}
