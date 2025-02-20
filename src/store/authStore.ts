import { create } from "zustand";
import axios from "../utils/axiosConfig";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,

  login: async (username, password) => {
    try {
      const resp = await axios.post("/auth/loginToken", {
        username,
        password,
      });
      const token = resp.data?.token;
      if (token) {
        localStorage.setItem("token", token);
        set({ token, isAuthenticated: true });
        return true;
      }
    } catch (err) {
      console.error("Login error", err);
    }
    return false;
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, isAuthenticated: false });
  },
}));
