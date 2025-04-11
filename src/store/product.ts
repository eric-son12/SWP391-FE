import { StoreGet, StoreSet } from "@/store";
import { Vaccine } from "@/types/vaccine";
import { Category } from "@/types/category";
import axios from "@/utils/axiosConfig";
import { toast } from "sonner";
import { ApiError } from "@/types/error";

export interface ProductState {
  vaccines: Vaccine[];
  categories: Category[];
}

export interface ProductActions {
  fetchVaccines: () => Promise<Vaccine[]>;
  createVaccine: (formData: FormData) => Promise<void>;
  updateVaccine: (vaccineId: number, formData: FormData) => Promise<void>;
  deleteVaccine: (vaccineId: number) => Promise<void>;
  fetchCategories: () => Promise<Category[]>;
  createCategory: (formData: FormData) => Promise<void>;
  updateCategory: (categoryId: number, formData: FormData) => Promise<void>;
  deleteCategory: (categoryId: number) => Promise<void>;
}

export const initialProduct: ProductState = {
  vaccines: [],
  categories: [],
};

export function productActions(set: StoreSet, get: StoreGet): ProductActions {
  return {
    fetchVaccines: async () => {
      set((state) => { state.loading.isLoading = true; });
      try {
        const token = localStorage.getItem("token")
        const resp = await axios.get("/product/products", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const vaccines: Vaccine[] = resp.data || [];
        set((state) => { state.product.vaccines = vaccines; });
        return vaccines;
      } catch (error: unknown) {
        const apiError = error as ApiError;
        const msg = apiError?.response?.data?.message || apiError?.message;
        toast.error(msg);
        return [];
      } finally {
        set((state) => { state.loading.isLoading = false; });
      }
    },

    createVaccine: async (formData: FormData) => {
      set((state) => { state.loading.isLoading = true; });
      try {
        const token = localStorage.getItem("token")
        const response = await axios.post("/product/addProduct", formData, {
          headers: { "Content-Type": "multipart/form-data", "Authorization": `Bearer ${token}` },
        });

        if (response.status === 200) {
          await axios.post(`/underlying-conditions/product/${response?.data.id}`, {
            condition: formData.get('condition')
          }, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            params: {
              productId: response.data.id,
            }
          });
        }
      await get().fetchVaccines();
      toast.success("Vaccine created successfully");
    } catch(error: unknown) {
      const apiError = error as ApiError;
      const msg = apiError?.response?.data?.message || apiError?.message;
      toast.error(msg);
    } finally {
      set((state) => { state.loading.isLoading = false; });
}
    },

updateVaccine: async (vaccineId: number, formData: FormData) => {
  set((state) => { state.loading.isLoading = true; });
  try {
    const token = localStorage.getItem("token")
    await axios.patch(`/product/updateProduct/${vaccineId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      },
    });
    await get().fetchVaccines();
    toast.success("Vaccine updated successfully");
  } catch (error: unknown) {
    const apiError = error as ApiError;
    const msg = apiError?.response?.data?.message || apiError?.message;
    toast.error(msg);
  } finally {
    set((state) => { state.loading.isLoading = false; });
  }
},

  deleteVaccine: async (vaccineId: number) => {
    set((state) => { state.loading.isLoading = true; });
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`/product/deleteProduct/${vaccineId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      await get().fetchVaccines();
      toast.success("Vaccine deleted successfully");
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const msg = apiError?.response?.data?.message || apiError?.message;
      toast.error(msg);

    } finally {
      set((state) => { state.loading.isLoading = false; });
    }
  },

    fetchCategories: async () => {
      set((state) => { state.loading.isLoading = true; });
      try {
        const token = localStorage.getItem("token")
        const resp = await axios.get("/category/showCategory", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data: Category[] = resp.data.result || [];
        set((state) => { state.product.categories = data; });
        return data;
      } catch (error: unknown) {
        const apiError = error as ApiError;
        const msg = apiError?.response?.data?.message || apiError?.message;
        toast.error(msg);
        return [];
      } finally {
        set((state) => { state.loading.isLoading = false; });
      }
    },

      createCategory: async (formData: FormData) => {
        set((state) => { state.loading.isLoading = true; });
        try {
          const token = localStorage.getItem("token")
          await axios.post("/category/createCategory", formData, {
            headers: { "Content-Type": "multipart/form-data", "Authorization": `Bearer ${token}` },
          });
          await get().fetchCategories();
          toast.success("Category created successfully");
        } catch (error: unknown) {
          const apiError = error as ApiError;
          const msg = apiError?.response?.data?.message || apiError?.message;
          toast.error(msg);
        } finally {
          set((state) => { state.loading.isLoading = false; });
        }
      },

        updateCategory: async (categoryId: number, formData: FormData) => {
          set((state) => { state.loading.isLoading = true; });
          try {
            const token = localStorage.getItem("token")
            await axios.put(`/category/updateCategory/${categoryId}`, formData, {
              headers: { "Content-Type": "multipart/form-data", "Authorization": `Bearer ${token}` },
            });
            await get().fetchCategories();
            toast.success("Category updated successfully");
          } catch (error: unknown) {
            const apiError = error as ApiError;
            const msg = apiError?.response?.data?.message || apiError?.message;
            toast.error(msg);
          } finally {
            set((state) => { state.loading.isLoading = false; });
          }
        },

          deleteCategory: async (categoryId: number) => {
            set((state) => { state.loading.isLoading = true; });
            try {
              const token = localStorage.getItem("token")
              await axios.delete(`/category/deleteCategory/${categoryId}`, {
                headers: {
                  "Authorization": `Bearer ${token}`
                }
              });
              await get().fetchCategories();
              toast.success("Category deleted successfully");
            } catch (error: unknown) {
              const apiError = error as ApiError;
              const msg = apiError?.response?.data?.message || apiError?.message;
              toast.error(msg);
            } finally {
              set((state) => { state.loading.isLoading = false; });
            }
          },
  };
}
