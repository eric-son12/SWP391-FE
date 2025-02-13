import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Draft } from "immer";
import { initialLoading, LoadingState } from "./store/loading";
import {
  initialProfile,
  profileActions,
  ProfileActions,
  ProfileState,
} from "./store/profile";
import {
  initialUsers,
  usersActions,
  UsersActions,
  UsersState,
} from "./store/users";
import {
  initialNotification,
  NotificationActions,
  notificationActions,
  NotificationState,
} from "./store/notification";

export interface State {
  loading: LoadingState;
  notification: NotificationState;
  profile: ProfileState;
  users: UsersState;
}

export type Actions = ProfileActions & UsersActions & NotificationActions;

export type Store = State & Actions;
export type StoreGet = () => Store;
export type StoreSet = (f: (state: Draft<State>) => void) => void;

export const useStore = create<Store, [["zustand/immer", never]]>(
  immer((set, get) => ({
    profile: initialProfile,
    ...profileActions(set, get),
    users: initialUsers,
    ...usersActions(set, get),
    notification: initialNotification,
    ...notificationActions(set, get),
    loading: initialLoading,
  }))
);
