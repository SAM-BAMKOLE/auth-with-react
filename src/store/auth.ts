import { create } from "zustand";

type IUser = {
  id: string;
  userName: string;
  email: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

interface IAuthStore {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: IUser | null;
  logout: () => void;
  login: (accessToken: string, user: IUser) => void;
  setAccessToken: (accessToken: string) => void;
}

export const useAuthStore = create<IAuthStore>((set) => ({
  isAuthenticated: false,
  accessToken: null,
  user: null,

  logout: () => set({ isAuthenticated: false, accessToken: null, user: null }),
  login: (accessToken: string, user: IUser) =>
    set({ isAuthenticated: true, accessToken, user }),
  setAccessToken: (accessToken: string) => set({ accessToken }),
}));
