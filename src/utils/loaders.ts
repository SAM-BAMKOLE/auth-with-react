import { useAuthStore } from "@/store/auth";
import { redirect } from "react-router";
import axiosInstance from "./axios";

interface ILoaderDataType {
  accessToken: string;
  user: {
    id: string;
    email: string;
    userName: string;
    createdAt: string;
    updatedAt: string;
  };
}
export async function dashboardLoader() {
  const { isAuthenticated, user, logout, login } = useAuthStore.getState();

  if (!isAuthenticated) {
    // Try to get another access token first
    try {
      const response = await axiosInstance.post("/api/auth/access-token/new");
      const data = response.data as ILoaderDataType;
      login(data.accessToken, data.user);
      return { user: data.user };
    } catch (error) {
      logout();
      return redirect("/signin");
    }
  }

  return { user };
}

export async function authenticationPagesLoader() {
  const { isAuthenticated } = useAuthStore.getState();
  if (isAuthenticated) {
    return redirect("/dashboard");
  }
}
