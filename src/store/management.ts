import { StoreGet, StoreSet } from "@/store";
import { Role, Permission } from "@/types/management";
import axios from "@/utils/axiosConfig";

export interface ManagementState {
  roles: Role[];
  permissions: Permission[];
}

export interface ManagementActions {
  fetchRoles: () => Promise<Role[]>;
  fetchPermissions: () => Promise<Permission[]>;
  createPermission: (params: { name: string; description: string; }) => Promise<Permission>;
  createRole: (params: { name: string; description: string; permissions: string[]; }) => Promise<Role>;
  deleteRole: (roleName: string) => Promise<any>;
  removePermission: (roleName: string, permissionName: string) => Promise<any>;
}

export const initialManagement: ManagementState = {
  roles: [],
  permissions: []
};

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
      } catch (error: any) {
        const msg = error?.response?.data?.message || error?.message;
        set((state) => {
          state.notification.data.push({ status: "ERROR", content: msg });
        }, false, "fetchRoles: error");
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
      } catch (error: any) {
        const msg = error?.response?.data?.message || error?.message;
        set((state) => {
          state.notification.data.push({ status: "ERROR", content: msg });
        }, false, "fetchPermissions: error");
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
        return data;
      } catch (error: any) {
        const msg = error?.response?.data?.message || error?.message;
        set((state) => {
          state.notification.data.push({ status: "ERROR", content: msg });
        }, false, "createPermission: error");
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
        return data;
      } catch (error: any) {
        const msg = error?.response?.data?.message || error?.message;
        set((state) => {
          state.notification.data.push({ status: "ERROR", content: msg });
        }, false, "createRole: error");
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
        return resp.data;
      } catch (error: any) {
        const msg = error?.response?.data?.message || error?.message;
        set((state) => {
          state.notification.data.push({ status: "ERROR", content: msg });
        }, false, "deleteRole: error");
        throw error;
      }
    },
    removePermission: async (roleName: string, permissionName: string) => {
      try {
        const resp = await axios.delete(`/manage/roles/${roleName}/permissions/${permissionName}`);
        return resp.data;
      } catch (error: any) {
        const msg = error?.response?.data?.message || error?.message;
        set((state) => {
          state.notification.data.push({ status: "ERROR", content: msg });
        }, false, "removePermission: error");
        throw error;
      }
    },
  };
}
