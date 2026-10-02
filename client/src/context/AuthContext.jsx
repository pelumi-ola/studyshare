import { createContext, useContext, useEffect, useState } from "react";
import { api, getToken, setToken } from "../lib/api";

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

// Accepts { user }, { data }, or the flat shape your login returns, and guarantees `_id`.
const pickUser = (d) => {
  const u = d?.user || d?.data || d;
  return u ? { ...u, _id: u._id || u.id } : u;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!getToken());

  useEffect(() => {
    if (!getToken()) return;
    api
      .profile()
      .then((d) => setUser(pickUser(d)))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const finish = async (d) => {
    const token = d?.token || d?.authToken || d?.accessToken;
    if (token) setToken(token);
    let u = pickUser(d);
    if (!u?.email) u = pickUser(await api.profile());
    setUser(u);
    return u;
  };

  const value = {
    user,
    loading,
    isAdmin: user?.role === "admin",
    login: async (b, admin) =>
      finish(await (admin ? api.adminLogin(b) : api.login(b))),
    register: async (b, admin) =>
      finish(await (admin ? api.adminRegister(b) : api.register(b))),
    refresh: async () => setUser(pickUser(await api.profile())),
    logout: () => {
      setToken(null);
      setUser(null);
    },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
