import { StoreGet, StoreSet } from "@/store";
import { Vaccine } from "@/types/vaccine";
import axios from "@/utils/axiosConfig";

export interface VaccineState {
  vaccines: Vaccine[];
}

export interface VaccineActions {
  fetchVaccines: () => Promise<Vaccine[]>;
  createVaccine: (formData: FormData) => Promise<void>;
  updateVaccine: (vaccineId: number, formData: FormData) => Promise<void>;
  deleteVaccine: (vaccineId: number) => Promise<void>;
}

export const initialVaccine: VaccineState = {
  vaccines: [],
};

export function vaccineActions(set: StoreSet, get: StoreGet): VaccineActions {
  return {
    fetchVaccines: async () => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const resp = await axios.get("/product/products");
        const vaccines: Vaccine[] = resp.data || [];
        set((state) => {
          state.vaccine.vaccines = vaccines;
        });
        return vaccines;
      } catch (error: any) {
        set((state) => {
          const msg = error?.response?.data?.message || error?.message;
          state.notification.data.push({
            status: "ERROR",
            content: msg,
          });
        });
        return [];
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },
    

    createVaccine: async (formData: FormData) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        await axios.post("/product/addProduct", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        get().fetchVaccines();
        set((state) => {
          state.notification.data.push({
            status: "SUCCESS",
            content: "Vaccine created successfully",
          });
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

    updateVaccine: async (vaccineId: number, formData: FormData) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        await axios.put(`/product/updateProduct/${vaccineId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        get().fetchVaccines();
        set((state) => {
          state.notification.data.push({
            status: "SUCCESS",
            content: "Vaccine updated successfully",
          });
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

    deleteVaccine: async (vaccineId: number) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        await axios.delete(`/product/deleteProduct/${vaccineId}`);
        get().fetchVaccines();
        set((state) => {
          state.notification.data.push({
            status: "SUCCESS",
            content: "Vaccine deleted successfully",
          });
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
  };
}