import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";
import { Draft } from "immer";
import { initialLoading, LoadingState } from "./store/loading";
import {
  initialProfile,
  profileActions,
  ProfileActions,
  ProfileState,
} from "./store/profile";
import {
  initialNotification,
  NotificationActions,
  notificationActions,
  NotificationState,
} from "./store/notification";
import { initialVaccine, VaccineActions, vaccineActions, VaccineState } from "./store/vaccine";

export interface State {
  loading: LoadingState;
  notification: NotificationState;
  profile: ProfileState;
  vaccine: VaccineState;
}

export type Actions = ProfileActions & NotificationActions & VaccineActions;

export type Store = State & Actions;
export type StoreGet = () => Store;
export type StoreSet = (f: (state: Draft<State>) => void) => void;

export const useStore = create<Store>()(
  devtools(
    immer((set, get) => ({
      profile: initialProfile,
      ...profileActions(set, get),
      vaccine: initialVaccine,
      ...vaccineActions(set, get),
      notification: initialNotification,
      ...notificationActions(set, get),
      loading: initialLoading,
    })),
    { name: "Zustand Store" }
  )
);
