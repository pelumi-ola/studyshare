import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LEVELS } from "../lib/constants";
import { Button, Field, Input, Select, useToast } from "../components/ui";

export default function Auth({ mode }) {
  const isReg = mode === "register";
  const [admin, setAdmin] = useState(false);
  const [f, setF] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    level: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const { login, register } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const toast = useToast();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const body = isReg ? f : { email: f.email, password: f.password };
      const u = isReg ? await register(body, admin) : await login(body, admin);
      toast(`Welcome${u?.name ? `, ${u.name.split(" ")[0]}` : ""}`);
      nav(loc.state?.from || (u?.role === "admin" ? "/admin" : "/resources"), {
        replace: true,
      });
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  };

  return (
    <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-5">
      <div className="md:col-span-2 md:pt-6">
        <h1 className="text-4xl font-extrabold">
          {isReg ? "Join your coursemates" : "Welcome back"}
        </h1>
        <p className="mt-3 text-ink/65">
          {isReg
            ? "Create an account to browse, download and upload course materials."
            : "Log in to find your course materials."}
        </p>
      </div>
      <form
        onSubmit={submit}
        className="space-y-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/10 sm:p-7 md:col-span-3"
      >
        <div
          className="grid grid-cols-2 gap-1 rounded-lg bg-ink/5 p-1"
          role="tablist"
        >
          {[
            ["Student", false],
            ["Admin", true],
          ].map(([l, v]) => (
            <button
              type="button"
              key={l}
              role="tab"
              aria-selected={admin === v}
              onClick={() => setAdmin(v)}
              className={`rounded-md py-2 text-sm font-semibold transition ${admin === v ? "bg-white shadow-sm" : "text-ink/60"}`}
            >
              {l}
            </button>
          ))}
        </div>
        {error && (
          <p
            role="alert"
            className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700"
          >
            {error}
          </p>
        )}
        {isReg && (
          <Field label="Full name">
            <Input
              required
              value={f.name}
              onChange={set("name")}
              autoComplete="name"
            />
          </Field>
        )}
        <Field label="Email">
          <Input
            type="email"
            required
            value={f.email}
            onChange={set("email")}
            autoComplete="email"
          />
        </Field>
        <Field
          label="Password"
          hint={isReg ? "At least 6 characters." : undefined}
        >
          <Input
            type="password"
            required
            minLength={6}
            value={f.password}
            onChange={set("password")}
            autoComplete={isReg ? "new-password" : "current-password"}
          />
        </Field>
        {isReg && !admin && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Department">
              <Input
                value={f.department}
                onChange={set("department")}
                placeholder="Computer Science"
              />
            </Field>
            <Field label="Level">
              <Select value={f.level} onChange={set("level")}>
                <option value="">Select level</option>
                {LEVELS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </Select>
            </Field>
          </div>
        )}
        <Button loading={busy} className="w-full">
          {isReg ? "Create account" : "Log in"}
        </Button>
        <p className="text-center text-sm text-ink/60">
          {isReg ? (
            <>
              Already registered?{" "}
              <Link className="font-semibold text-cobalt" to="/login">
                Log in
              </Link>
            </>
          ) : (
            <>
              New here?{" "}
              <Link className="font-semibold text-cobalt" to="/register">
                Create an account
              </Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
