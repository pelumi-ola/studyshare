import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, asItem, idOf } from "../lib/api";
import { TYPES, fmtDate, fmtSize } from "../lib/constants";
import { useAuth } from "../context/AuthContext";
import ReportModal from "../components/ReportModal";
import EditResourceModal from "../components/EditResourceModal";
import {
  Badge,
  Button,
  Empty,
  Loading,
  Modal,
  useToast,
} from "../components/ui";

export default function ResourceDetail() {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const nav = useNavigate();
  const toast = useToast();
  const [r, setR] = useState(null);
  const [err, setErr] = useState("");
  const [report, setReport] = useState(false);
  const [edit, setEdit] = useState(false);
  const [del, setDel] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const res = asItem(await api.resource(id), "resource");
      let course = res.course;
      if (course && typeof course !== "object") {
        try {
          course = asItem(await api.course(course), "course");
        } catch {
          course = null;
        }
      }
      setR({ ...res, course });
    } catch (e) {
      setErr(e.message);
    }
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (err) return <Empty title="Resource not found">{err}</Empty>;
  if (!r) return <Loading />;
  const t = TYPES[r.resourceType] || TYPES.other;
  const owner = idOf(r.uploadedBy) === user?._id;
  const uploader = typeof r.uploadedBy === "object" ? r.uploadedBy?.name : null;
  const c = r.course;

  const remove = async () => {
    setBusy(true);
    try {
      await api.deleteResource(r._id);
      toast("Resource deleted");
      nav("/my-resources");
    } catch (e) {
      toast(e.message, "err");
      setBusy(false);
    }
  };

  const download = async () => {
    try {
      const { url } = await api.download(r._id);
      window.location.href = url; // browser downloads it with the original filename
      setR({ ...r, downloadCount: (r.downloadCount || 0) + 1 });
    } catch (e) {
      toast(e.message, "err");
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/resources" className="text-sm font-semibold text-cobalt">
        Back to browse
      </Link>
      <article className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/10">
        <div className={`h-2 ${t.bar}`} />
        <div className="p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={t.tone}>{t.label}</Badge>
            {c && <Badge>{c.courseCode}</Badge>}
            {c && <Badge>{c.level} level</Badge>}
          </div>
          <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">
            {r.title}
          </h1>
          <p className="mt-4 whitespace-pre-line text-ink/75">
            {r.description}
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-canvas p-4 text-sm sm:grid-cols-4">
            {[
              ["Course", c ? c.courseTitle : "—"],
              ["Department", c?.department || "—"],
              ["File", `${fmtSize(r.fileSize)}`],
              ["Downloads", r.downloadCount || 0],
              ["Uploaded by", uploader || "A student"],
              ["Added", fmtDate(r.createdAt)],
              ["File name", r.fileName],
            ].map(([k, v]) => (
              <div key={k} className="min-w-0">
                <dt className="text-ink/55">{k}</dt>
                <dd className="truncate font-semibold" title={String(v)}>
                  {v}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              variant="marker"
              onClick={download}
              className="px-6 py-3 text-base"
            >
              Download
            </Button>
            {(owner || isAdmin) && (
              <Button variant="ghost" onClick={() => setEdit(true)}>
                Edit
              </Button>
            )}
            {(owner || isAdmin) && (
              <Button
                variant="soft"
                className="text-rose-700"
                onClick={() => setDel(true)}
              >
                Delete
              </Button>
            )}
            {!owner && (
              <Button variant="soft" onClick={() => setReport(true)}>
                Report
              </Button>
            )}
          </div>
        </div>
      </article>
      <ReportModal
        open={report}
        onClose={() => setReport(false)}
        resourceId={r._id}
      />
      <EditResourceModal
        open={edit}
        onClose={() => setEdit(false)}
        resource={r}
        onSaved={load}
      />
      <Modal
        open={del}
        onClose={() => setDel(false)}
        title="Delete this resource?"
      >
        <p className="text-sm text-ink/70">
          "{r.title}" will be removed for everyone. This can't be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDel(false)}>
            Keep it
          </Button>
          <Button variant="danger" loading={busy} onClick={remove}>
            Delete resource
          </Button>
        </div>
      </Modal>
    </div>
  );
}
