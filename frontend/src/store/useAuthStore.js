import { create } from "zustand";
import { axiosInstance } from "../lib/axiuos.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  isOnline: false,

  // ====================
  // Check auth status
  // ====================
  authCheck: async () => {
    set({ isCheckingAuth: true });

    try {
      const res = await axiosInstance.get("/auth/check", { withCredentials: true });
      set({
        authUser: res.data,
        isOnline: true, // User is online if the check passes
      });
    } catch (error) {
      console.error("Auth check failed:", error);
      set({ authUser: null, isOnline: false }); // User is offline if check fails
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ====================
  // Signup
  // ====================
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({
        authUser: res.data,
        isOnline: true, // User is online after signup
      });
      toast.success("Account created successfully");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  // ====================
  // Login
  // ====================
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({
        authUser: res.data,
        isOnline: true, // User is online after login
      });
      toast.success("Logged in successfully");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // ====================
  // Logout
  // ====================
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({
        authUser: null,
        isOnline: false, // User is offline after logout
      });

      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  },

  // ====================
  // Update Profile
  // ====================
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/updateProfile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
