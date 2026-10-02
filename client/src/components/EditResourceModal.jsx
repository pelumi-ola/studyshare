import { useEffect, useState } from "react";
import { api, asList, idOf } from "../lib/api";
import { TYPES } from "../lib/constants";
import { Button, Field, Input, Modal, Select, Textarea, useToast } from "./ui";

export default function EditResourceModal({
  open,
  onClose,
  resource,
  onSaved,
}) {
  const [f, setF] = useState({});
  const [courses, setCourses] = useState([]);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!open || !resource) return;
    setF({
      title: resource.title,
      description: resource.description,
      course: idOf(resource.course),
      resourceType: resource.resourceType,
    });
    api
      .courses()
      .then((d) => setCourses(asList(d, "courses")))
      .catch(() => {});
  }, [open, resource]);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.updateResource(resource._id, f);
      toast("Changes saved");
      onSaved();
      onClose();
    } catch (err) {
      toast(err.message, "err");
    }
    setBusy(false);
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit resource">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Title">
          <Input required value={f.title || ""} onChange={set("title")} />
        </Field>
        <Field label="Description">
          <Textarea
            required
            value={f.description || ""}
            onChange={set("description")}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Course">
            <Select required value={f.course || ""} onChange={set("course")}>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.courseCode} — {c.courseTitle}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Type">
            <Select value={f.resourceType || ""} onChange={set("resourceType")}>
              {Object.entries(TYPES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={busy}>Save changes</Button>
        </div>
      </form>
    </Modal>
  );
}
