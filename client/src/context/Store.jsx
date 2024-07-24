import { create } from 'zustand';

const safeParseJSON = (item) => {
  try {
    return JSON.parse(item);
  } catch (e) {
    return null;
  }
};

export const useStore = create((set) => ({
  apiURL: import.meta.env.VITE_API_URL,
  user: safeParseJSON(localStorage.getItem("user")) || null,
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
  admin: safeParseJSON(localStorage.getItem("admin")) || null,
  setAdmin: (admin) => {
    localStorage.setItem("admin", JSON.stringify(admin));
    set({ admin });
  },
  token: localStorage.getItem("token") || null,
  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    set({ user: null, token: null, admin: null });
  }
}));
