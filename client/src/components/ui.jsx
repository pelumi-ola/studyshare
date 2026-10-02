import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const cx = (...a) => a.filter(Boolean).join(" ");

export function Button({
  variant = "primary",
  className,
  loading,
  children,
  ...p
}) {
  const v = {
    primary: "bg-cobalt text-white hover:bg-cobalt-dark",
    marker: "bg-marker text-ink hover:brightness-95",
    ghost: "bg-white text-ink ring-1 ring-ink/15 hover:bg-ink/5",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
    soft: "bg-ink/5 text-ink hover:bg-ink/10",
  }[variant];
  return (
    <button
      {...p}
      disabled={loading || p.disabled}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed",
        v,
        className,
      )}
    >
      {loading && <Spinner small />}
      {children}
    </button>
  );
}

export function Spinner({ small }) {
  return (
    <span
      className={cx(
        "inline-block animate-spin rounded-full border-2 border-current border-t-transparent",
        small ? "size-4" : "size-8 text-cobalt",
      )}
      role="status"
      aria-label="Loading"
    />
  );
}
export const Loading = () => (
  <div className="flex justify-center py-20">
    <Spinner />
  </div>
);

const field =
  "w-full rounded-lg border-0 bg-white px-3.5 py-2.5 text-sm ring-1 ring-ink/15 placeholder:text-ink/40 focus:ring-2 focus:ring-cobalt";
export function Field({ label, hint, children, className }) {
  return (
    <label className={cx("block", className)}>
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink/55">{hint}</span>}
    </label>
  );
}
export const Input = (p) => <input {...p} className={cx(field, p.className)} />;
export const Textarea = (p) => (
  <textarea rows={4} {...p} className={cx(field, p.className)} />
);
export const Select = ({ children, ...p }) => (
  <select {...p} className={cx(field, "pr-8", p.className)}>
    {children}
  </select>
);

export const Badge = ({ tone = "bg-ink/10 text-ink", children }) => (
  <span
    className={cx(
      "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold",
      tone,
    )}
  >
    {children}
  </span>
);

export function Empty({ title, children, action }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-ink/15 bg-white/60 px-6 py-14 text-center">
      <h3 className="text-lg font-bold">{title}</h3>
      {children && (
        <p className="mx-auto mt-1 max-w-sm text-sm text-ink/60">{children}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const k = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-canvas p-5 shadow-2xl sm:rounded-2xl sm:p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-2xl leading-none text-ink/50 hover:text-ink"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const ToastCtx = createContext(() => {});
export const useToast = () => useContext(ToastCtx);
export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const push = useCallback((msg, type = "ok") => {
    const id = Math.random();
    setItems((s) => [...s, { id, msg, type }]);
    setTimeout(() => setItems((s) => s.filter((i) => i.id !== id)), 4000);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div
        className="fixed inset-x-4 bottom-4 z-[60] flex flex-col items-center gap-2 sm:left-auto sm:items-end"
        aria-live="polite"
      >
        {items.map((i) => (
          <div
            key={i.id}
            className={cx(
              "w-full max-w-sm rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg",
              i.type === "ok" ? "bg-ink" : "bg-rose-600",
            )}
          >
            {i.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const PageHead = ({ title, children, action }) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
    <div>
      <h1 className="text-3xl font-extrabold sm:text-4xl">{title}</h1>
      {children && <p className="mt-1 max-w-xl text-ink/65">{children}</p>}
    </div>
    {action}
  </div>
);
