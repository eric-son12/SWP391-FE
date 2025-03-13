import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools, persist } from "zustand/middleware";
import { Draft } from "immer";
import { initialLoading, LoadingState } from "./store/loading";
import {
  initialProfile,
  profileActions,
  ProfileActions,
  ProfileState,
} from "@/store/profile";
import {
  initialNotification,
  NotificationActions,
  notificationActions,
  NotificationState,
} from "@/store/notification";
import { initialVaccine, vaccineActions, VaccineActions, VaccineState } from "@/store/vaccine";
import { initialManagement, managementActions, ManagementActions, ManagementState } from "./store/management";

export interface State {
  loading: LoadingState;
  notification: NotificationState;
  profile: ProfileState;
  vaccine: VaccineState;
  management: ManagementState
}

export type StoreSet = {
  <U>(f: (state: Draft<State>) => U, replace?: false, action?: string): void;
  <U>(f: (state: Draft<State>) => U, replace: true, action?: string): void;
};

export type Actions = ProfileActions & NotificationActions & VaccineActions & ManagementActions;
export type Store = State & Actions;
export type StoreGet = () => Store;

export const useStore = create<Store>()(
  devtools(
    persist(
      immer((set, get) => ({
        profile: initialProfile,
        ...profileActions(set, get),
        vaccine: initialVaccine,
        ...vaccineActions(set, get),
        notification: initialNotification,
        ...notificationActions(set, get),
        management: initialManagement,
        ...managementActions(set, get),
        loading: initialLoading,
      })),
      { name: "zustand-store"}
    )
  )
);