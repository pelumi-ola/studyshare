export const TYPES = {
  "lecture-note": {
    label: "Lecture note",
    tone: "bg-blue-100 text-blue-800",
    bar: "bg-blue-500",
  },
  "past-question": {
    label: "Past question",
    tone: "bg-amber-100 text-amber-900",
    bar: "bg-amber-500",
  },
  "study-guide": {
    label: "Study guide",
    tone: "bg-emerald-100 text-emerald-800",
    bar: "bg-emerald-500",
  },
  "course-summary": {
    label: "Course summary",
    tone: "bg-violet-100 text-violet-800",
    bar: "bg-violet-500",
  },
  assignment: {
    label: "Assignment",
    tone: "bg-rose-100 text-rose-800",
    bar: "bg-rose-500",
  },
  other: {
    label: "Other",
    tone: "bg-slate-200 text-slate-700",
    bar: "bg-slate-400",
  },
};
export const LEVELS = ["100", "200", "300", "400", "500"];
export const REPORT_REASONS = [
  "Copyright violation",
  "Inappropriate content",
  "Misleading information",
  "Does not belong here",
  "Uploaded without permission",
];
export const REPORT_STATUS = ["pending", "reviewed", "resolved", "dismissed"];
export const fmtSize = (b) =>
  !b
    ? "—"
    : b > 1048576
      ? `${(b / 1048576).toFixed(1)} MB`
      : `${Math.max(1, Math.round(b / 1024))} KB`;
export const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";
