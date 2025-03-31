import { StoreGet, StoreSet } from "@/store";
import { Role, Permission } from "@/types/management";
import axios from "@/utils/axiosConfig";
import { toast } from "sonner";

export interface ManagementState {
  roles: Role[];
  permissions: Permission[];
}

interface ApiResponse<T> {
  result: T;
  message?: string;
  status?: number;
}

export interface ManagementActions {
  fetchRoles: () => Promise<Role[]>;
  createRole: (params: { name: string; description: string; permissions: string[]; }) => Promise<Role>;
  deleteRole: (roleName: string) => Promise<ApiResponse<Role>>;
  fetchPermissions: () => Promise<Permission[]>;
  createPermission: (params: { name: string; description: string; }) => Promise<Permission>;
  deletePermission: (permission: string) => Promise<ApiResponse<Permission>>;
  removePermission: (roleName: string, permissionName: string) => Promise<ApiResponse<void>>;
}

export const initialManagement: ManagementState = {
  roles: [],
  permissions: []
};

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export function managementActions(set: StoreSet, get: StoreGet): ManagementActions {
  return {
    fetchRoles: async () => {
      set((state) => { state.loading.isLoading = true; }, false, "loading: start");
      try {
        const resp = await axios.get("/manage/roles");
        const data: Role[] = resp.data.result || [];
        set((state) => {
          state.management.roles = data;
        }, false, "fetchRoles: success");
        return data;
      } catch (error: unknown) {
        const apiError = error as ApiError;
        const msg = apiError?.response?.data?.message || apiError?.message;
        toast.error(msg);
        return [];
      } finally {
        set((state) => { state.loading.isLoading = false; }, false, "loading: end");
      }
    },
    fetchPermissions: async () => {
      set((state) => { state.loading.isLoading = true; }, false, "loading: start");
      try {
        const resp = await axios.get("/permissions/getAll");
        const data: Permission[] = resp.data.result || [];
        set((state) => {
          state.management.permissions = data;
        }, false, "fetchPermissions: success");
        return data;
      } catch (error: unknown) {
        const apiError = error as ApiError;
        const msg = apiError?.response?.data?.message || apiError?.message;
        toast.error(msg);
        return [];
      } finally {
        set((state) => { state.loading.isLoading = false; }, false, "loading: end");
      }
    },
    createPermission: async (params: { name: string; description: string; }) => {
      set((state) => { state.loading.isLoading = true; }, false, "loading: start");
      try {
        const resp = await axios.post("/permissions/create", params);
        const data: Permission = resp.data.result;
        set((state) => {
          state.management.permissions.push(data);
        }, false, "createPermission: success");
        toast.success("Permission created successfully");
        return data;
      } catch (error: unknown) {
        const apiError = error as ApiError;
        const msg = apiError?.response?.data?.message || apiError?.message;
        toast.error(msg);
        throw error;
      } finally {
        set((state) => { state.loading.isLoading = false; }, false, "loading: end");
      }
    },
    createRole: async (params: { name: string; description: string; permissions: string[]; }) => {
      set((state) => { state.loading.isLoading = true; }, false, "loading: start");
      try {
        const resp = await axios.post("/manage/createRole", params);
        const data: Role = resp.data.result;
        get().fetchRoles();
        set((state) => {
          state.management.roles.push(data);
        }, false, "createRole: success");
        toast.success("Role created successfully");
        return data;
      } catch (error: unknown) {
        const apiError = error as ApiError;
        const msg = apiError?.response?.data?.message || apiError?.message;
        toast.error(msg);
        throw error;
      } finally {
        set((state) => { state.loading.isLoading = false; }, false, "loading: end");
      }
    },
    deleteRole: async (roleName: string) => {
      try {
        const resp = await axios.delete(`/manage/${roleName}`);
        get().fetchRoles();
        set((state) => {
          state.management.roles = state.management.roles.filter((r) => r.name !== roleName);
        }, false, "deleteRole: success");
        toast.success("Role deleted successfully");
        return resp.data;
      } catch (error: unknown) {
        const apiError = error as ApiError;
        const msg = apiError?.response?.data?.message || apiError?.message;
        toast.error(msg);
        throw error;
      }
    },
    removePermission: async (roleName: string, permissionName: string) => {
      try {
        const resp = await axios.delete(`/manage/roles/${roleName}/permissions/${permissionName}`);
        toast("Permission removed from role successfully");
        return resp.data;
      } catch (error: unknown) {
        const apiError = error as ApiError;
        const msg = apiError?.response?.data?.message || apiError?.message;
        toast(msg);
        throw error;
      }
    },
    deletePermission: async (permission: string) => {
      set((state) => {
        state.loading.isLoading = true;
      }, false, "loading: start");
      try {
        const resp = await axios.delete(`/permissions/delete/${permission}`);
        set((state) => {
          state.management.permissions = state.management.permissions.filter(
            (p) => p.name !== permission
          );
        }, false, "deletePermission: success");
        toast.success("Permission deleted successfully");
        return resp.data;
      } catch (error: unknown) {
        const apiError = error as ApiError;
        const msg = apiError?.response?.data?.message || apiError?.message;
        toast.error(msg);
        throw error;
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        }, false, "loading: end");
      }
    },
  };
}
