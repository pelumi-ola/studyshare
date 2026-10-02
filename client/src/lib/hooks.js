import { useCallback, useEffect, useState } from "react";
import { api, asList } from "./api";

// Loads resources + courses and makes sure every resource has a populated `course` object.
export function useCatalog() {
  const [state, setState] = useState({
    resources: [],
    courses: [],
    loading: true,
    error: "",
  });
  const load = useCallback(async () => {
    try {
      const [r, c] = await Promise.all([api.resources(), api.courses()]);
      const courses = asList(c, "courses");
      const map = Object.fromEntries(courses.map((x) => [x._id, x]));
      const resources = asList(r, "resources").map((x) => ({
        ...x,
        course:
          typeof x.course === "object" && x.course
            ? x.course
            : map[x.course] || null,
      }));
      setState({ resources, courses, loading: false, error: "" });
    } catch (e) {
      setState((s) => ({ ...s, loading: false, error: e.message }));
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  return { ...state, reload: load };
}
