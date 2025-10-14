import { useAuthStore } from "@/store/auth";
import axiosInstance from "./axios";

export async function userSignup(data: {
  userName: string;
  email: string;
  password: string;
}) {
  try {
    // http://localhost:3550
    const response = await axiosInstance.post("/api/auth/signup", data);

    if (!response) {
      console.error("No response returned from axiosInstance.post");
      return false;
    }
    return response.data;
  } catch (error: any) {
    console.error(error);

    if (error.response) return { error: true, data: error.response.data };
    return { error: true };
  }
}

export async function userSignin(data: { email: string; password: string }) {
  try {
    const response = await axiosInstance.post("/api/auth/signin", data);

    if (!response) {
      console.error("No response returned from axiosInstance.post");
      return false;
    }
    return response.data;
  } catch (error: any) {
    console.error(error);

    if (error.response) return { error: true, data: error.response.data };
    return { error: true };
  }
}

export async function userSignout() {
  try {
    const response = await axiosInstance.post("/api/auth/signout");
    useAuthStore.getState().logout();
    return response.data;
  } catch (error) {
    useAuthStore.getState().logout();
    return { message: "You have been signed out successfully!" };
  }
}
