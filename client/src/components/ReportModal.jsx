import { useState } from "react";
import { api } from "../lib/api";
import { REPORT_REASONS } from "../lib/constants";
import { Button, Field, Modal, Select, Textarea, useToast } from "./ui";

export default function ReportModal({ open, onClose, resourceId }) {
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.createReport({ resource: resourceId, reason, description });
      toast("Report sent. A moderator will review it.");
      setDescription("");
      onClose();
    } catch (err) {
      toast(err.message, "err");
    }
    setBusy(false);
  };

  return (
    <Modal open={open} onClose={onClose} title="Report this resource">
      <form onSubmit={submit} className="space-y-4">
        <Field label="What's wrong?">
          <Select value={reason} onChange={(e) => setReason(e.target.value)}>
            {REPORT_REASONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </Select>
        </Field>
        <Field
          label="Details"
          hint="Optional. Help the moderator understand the problem."
        >
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={busy}>Send report</Button>
        </div>
      </form>
    </Modal>
  );
}
