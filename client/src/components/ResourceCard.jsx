import { Link } from "react-router-dom";
import { TYPES, fmtDate, fmtSize } from "../lib/constants";
import { Badge } from "./ui";

export default function ResourceCard({ r, actions }) {
  const t = TYPES[r.resourceType] || TYPES.other;
  const course = r.course && typeof r.course === "object" ? r.course : null;
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-ink/10 transition hover:shadow-md hover:ring-cobalt/40">
      <div className={`h-1.5 ${t.bar}`} />
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <Badge tone={t.tone}>{t.label}</Badge>
          {course && (
            <span className="font-display text-sm font-bold text-ink/70">
              {course.courseCode}
            </span>
          )}
        </div>
        <h3 className="mt-3 text-lg font-bold leading-snug">
          <Link
            to={`/resources/${r._id}`}
            className="after:absolute after:inset-0 hover:text-cobalt"
          >
            {r.title}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-ink/65">
          {r.description}
        </p>
        {course && (
          <p className="mt-3 text-xs text-ink/55">
            {course.courseTitle} · {course.level} level
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-4 text-xs text-ink/55">
          <span>
            {fmtSize(r.fileSize)} · {r.downloadCount || 0} downloads
          </span>
          <span>{fmtDate(r.createdAt)}</span>
        </div>
      </div>
      {actions && (
        <div className="relative z-10 flex gap-2 border-t border-ink/10 bg-canvas/60 p-3">
          {actions}
        </div>
      )}
    </article>
  );
}
