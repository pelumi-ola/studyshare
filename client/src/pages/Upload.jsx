import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, asItem, asList } from "../lib/api";
import { TYPES, fmtSize } from "../lib/constants";
import {
  Button,
  Empty,
  Field,
  Input,
  PageHead,
  Select,
  Textarea,
  useToast,
} from "../components/ui";

const MAX = 10 * 1024 * 1024;

export default function Upload() {
  const [courses, setCourses] = useState([]);
  const [f, setF] = useState({
    title: "",
    description: "",
    course: "",
    resourceType: "lecture-note",
  });
  const [file, setFile] = useState(null);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const input = useRef();
  const nav = useNavigate();
  const toast = useToast();

  useEffect(() => {
    api
      .courses()
      .then((d) => setCourses(asList(d, "courses")))
      .catch((e) => setError(e.message));
  }, []);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const ACCEPT = ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png";

  const pick = (x) => {
    if (!x) return;
    const ext = "." + x.name.split(".").pop().toLowerCase();
    if (!ACCEPT.split(",").includes(ext))
      return setError("That file type isn't supported.");
    if (x.size > MAX)
      return setError("That file is over 10 MB. Compress it and try again.");
    setError("");
    setFile(x);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return setError("Choose a PDF to upload.");
    if (!ok)
      return setError("Confirm you have permission to share this resource.");
    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(f).forEach(([k, v]) => fd.append(k, v));
      fd.append("sharingPermissionConfirmed", "true");
      fd.append("file", file);
      const res = asItem(await api.createResource(fd), "resource");
      toast("Resource uploaded");
      nav(res?._id ? `/resources/${res._id}` : "/my-resources");
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  };

  if (courses.length === 0 && !error) return null;
  return (
    <div className="mx-auto max-w-2xl">
      <PageHead title="Upload a resource">
        Add a PDF that would have helped you. Clear titles get downloaded more.
      </PageHead>
      {!courses.length ? (
        <Empty title="No courses available yet">
          An admin needs to add courses before resources can be uploaded.
        </Empty>
      ) : (
        <form
          onSubmit={submit}
          className="space-y-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/10 sm:p-7"
        >
          {error && (
            <p
              role="alert"
              className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700"
            >
              {error}
            </p>
          )}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              pick(e.dataTransfer.files[0]);
            }}
            className={`rounded-xl border-2 border-dashed p-6 text-center transition ${drag ? "border-cobalt bg-cobalt/5" : "border-ink/20"}`}
          >
            {file ? (
              <div>
                <p className="font-semibold break-all">{file.name}</p>
                <p className="text-sm text-ink/55">{fmtSize(file.size)}</p>
                <button
                  type="button"
                  className="mt-2 text-sm font-semibold text-cobalt"
                  onClick={() => setFile(null)}
                >
                  Choose a different file
                </button>
              </div>
            ) : (
              <div>
                <p className="font-semibold">Drop a File here</p>
                <p className="text-sm text-ink/55">or</p>
                <Button
                  type="button"
                  variant="ghost"
                  className="mt-2"
                  onClick={() => input.current.click()}
                >
                  Browse files
                </Button>
                <p className="mt-2 text-xs text-ink/50">
                  Supported types: PDF, DOC, PPT, XLS, TXT, JPG, PNG
                </p>
              </div>
            )}
            <input
              ref={input}
              type="file"
              accept={ACCEPT}
              hidden
              onChange={(e) => pick(e.target.files[0])}
            />
          </div>
          <Field label="Title">
            <Input
              required
              value={f.title}
              onChange={set("title")}
              placeholder="CSC301 Algorithms 2023/24 past questions"
            />
          </Field>
          <Field label="Description">
            <Textarea
              required
              value={f.description}
              onChange={set("description")}
              placeholder="What's inside, which session or lecturer, anything that helps someone decide."
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Course">
              <Select required value={f.course} onChange={set("course")}>
                <option value="">Select a course</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.courseCode} — {c.courseTitle}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Resource type">
              <Select value={f.resourceType} onChange={set("resourceType")}>
                {Object.entries(TYPES).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <label className="flex items-start gap-3 rounded-lg bg-marker/30 p-3 text-sm">
            <input
              type="checkbox"
              checked={ok}
              onChange={(e) => setOk(e.target.checked)}
              className="mt-0.5 size-4 accent-cobalt"
            />
            <span>
              I confirm that I have permission to share this resource.
            </span>
          </label>
          <div className="flex justify-end gap-2">
            <Link to="/resources">
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </Link>
            <Button loading={busy}>Upload resource</Button>
          </div>
        </form>
      )}
    </div>
  );
}
