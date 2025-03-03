import { ChildProfile, User, UserProfile } from "../models/user";
import type { StoreGet, StoreSet } from "../store";
import axios from "../utils/axiosConfig";

export interface ProfileState {
  user: User | undefined;
  myInfo: UserProfile | undefined;
  children: ChildProfile[];
  allUsers: UserProfile[];
  userProfile: UserProfile | undefined;
  error: string | undefined;
}

export interface ProfileActions {
  fetchAllUsers: () => Promise<void>;
  fetchMyInfo: () => Promise<void>;
  registerUser: (payload: {
    username: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<void>;
  verifyUser: (email: string, code: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  fetchAllChildren: () => Promise<void>;
  createChild: (parentId: string, childRequest: { fullName: string; dob: string; gender: string }) => Promise<void>;
  updateMyChild: (childId: string, childRequest: { fullName: string; dob: string; gender: string }) => Promise<void>;
}

export const initialProfile: ProfileState = {
  user: undefined,
  userProfile: undefined,
  children: [],
  error: undefined,
  allUsers: [],
  myInfo: undefined,
};

export function profileActions(set: StoreSet, get: StoreGet): ProfileActions {
  return {
    fetchAllUsers: async () => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const resp = await axios.get(`/users`);
        set((state) => {
          state.profile.allUsers = resp.data || [];
        });
      } catch (error: any) {
        set((state) => {
          const msg = error?.response?.data?.message || error?.message;
          state.notification.data.push({
            status: "ERROR",
            content: msg,
          });
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },

    fetchMyInfo: async () => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const resp = await axios.get(`/users/myInfo`);
        const info = resp.data?.result || resp.data;
        set((state) => {
          state.profile.myInfo = info;
        });
      } catch (error: any) {
        const msg = error?.response?.data?.message || error?.message;
        set((state) => {
          state.notification.data.push({
            status: "ERROR",
            content: msg,
          });
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },

    registerUser: async (payload) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        await axios.post(`/users/createUser`, payload);
        set((state) => {
          state.notification.data.push({
            status: "SUCCESS",
            content: "Tạo tài khoản thành công! Vui lòng kiểm tra email để xác thực.",
          });
        });
      } catch (error: any) {
        const msg = error?.response?.data?.message || error?.message;
        set((state) => {
          state.notification.data.push({
            status: "ERROR",
            content: msg,
          });
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },

    verifyUser: async (email, code) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const body = { email, code };
        await axios.post(`/users/verify`, body);
        set((state) => {
          state.notification.data.push({
            status: "SUCCESS",
            content: "Xác thực email thành công!",
          });
        });
      } catch (error: any) {
        const msg = error?.response?.data?.message || error?.message;
        set((state) => {
          state.notification.data.push({
            status: "ERROR",
            content: msg,
          });
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },

    resendVerification: async (email) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        await axios.post(`/users/resend`, { email });
        set((state) => {
          state.notification.data.push({
            status: "SUCCESS",
            content: "Mã xác thực mới đã được gửi!",
          });
        });
      } catch (error: any) {
        const msg = error?.response?.data?.message || error?.message;
        set((state) => {
          state.notification.data.push({
            status: "ERROR",
            content: msg,
          });
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },

    login: async (username: string, password: string) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const response = await axios.post(`/auth/loginToken`, { username, password });
        const token = response.data?.token;
        const role = response.data?.role;
        const user = response.data;
        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("role", role);
        }
        set((state) => {
          state.profile.user = user;
          state.notification.data.push({
            content: "Login success!",
            status: "SUCCESS",
          });
        });
      } catch (error: any) {
        const msg = error?.response?.data?.message || error?.message;
        set((state) => {
          state.notification.data.push({
            status: "ERROR",
            content: msg,
          });
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },

    fetchProfile: async () => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const response = await axios.post(`/users/profile`);
        const profile = response.data?.data || undefined;
        set((state) => {
          state.profile.userProfile = profile;
        });
      } catch (error: any) {
        const message = error?.response?.data?.message || error?.message;
        set((state) => {
          state.notification.data.push({
            status: "ERROR",
            content: message,
          });
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },

    updateProfile: async (data) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const response = await axios.post(`/users/profile/update`, data);
        const profile = response.data?.data || undefined;
        set((state) => {
          state.profile.userProfile = profile;
          state.notification.data.push({
            status: "SUCCESS",
            content: "Update profile successfully",
          });
        });
      } catch (error: any) {
        const message = error?.response?.data?.message || error?.message;
        set((state) => {
          state.notification.data.push({
            status: "ERROR",
            content: message,
          });
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },

    deleteUser: async (userId: string) => {
      set((state: any) => { state.loading.isLoading = true; });
      try {
        await axios.delete(`/users/delete/${userId}`);
        get().fetchAllUsers();
      } catch (error: any) {
        set((state: any) => {
          state.profile.error = error.response?.data?.message || error.message;
        });
      } finally {
        set((state: any) => { state.loading.isLoading = false; });
      }
    },

    logout: async () => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const response = await axios.post(`/logout`);
        set((state) => {
          if (response.data.code === "LOGOUT_SUCCESS") {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            state.profile.user = undefined;
          }
          state.notification.data.push({
            content: response.data.message,
            status: "SUCCESS",
          });
        });
      } catch (error: any) {
        const msg = error?.response?.data?.message || error?.message;
        set((state) => {
          state.notification.data.push({
            status: "ERROR",
            content: msg,
          });
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },

    changePassword: async (oldPassword: string, newPassword: string) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const body = {
          oldPassword,
          newPassword,
          confirmPassword: newPassword,
        };
        await axios.post(`/users/changePassword`, body);
        set((state) => {
          state.notification.data.push({
            status: "SUCCESS",
            content: "Change password successfully",
          });
        });
      } catch (error: any) {
        const msg = error?.response?.data?.message || error?.message;
        set((state) => {
          state.notification.data.push({
            status: "ERROR",
            content: msg,
          });
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },

    fetchAllChildren: async () => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const response = await axios.get("/staff/children");
        set((state) => {
          state.profile.children = response.data || [];
        });
      } catch (error: any) {
        const msg = error?.response?.data?.message || error?.message;
        set((state) => {
          state.notification.data.push({
            status: "ERROR",
            content: msg,
          });
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },

    createChild: async (parentId: string, childRequest) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        await axios.post(`/staff/children/create/${parentId}`, childRequest);
        get().fetchAllChildren();
        set((state) => {
          state.notification.data.push({
            status: "SUCCESS",
            content: "Child profile created successfully",
          });
        });
      } catch (error: any) {
        const msg = error?.response?.data?.message || error?.message;
        set((state) => {
          state.notification.data.push({
            status: "ERROR",
            content: msg,
          });
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },

    updateMyChild: async (childId: string, childRequest) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        await axios.put(`/staff/children/${childId}/update`, childRequest);
        get().fetchAllChildren();
        set((state) => {
          state.notification.data.push({
            status: "SUCCESS",
            content: "Child profile updated successfully",
          });
        });
      } catch (error: any) {
        const msg = error?.response?.data?.message || error?.message;
        set((state) => {
          state.notification.data.push({
            status: "ERROR",
            content: msg,
          });
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },
  };
}
