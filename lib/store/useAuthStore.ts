import { create } from "zustand";

interface AuthState {
  userType: "admin" | "member" | null;
  setUserType: (type: "admin" | "member" | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userType: null,
  setUserType: (type) => set({ userType: type }),
}));
