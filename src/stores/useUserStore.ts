import { create, type StateCreator } from "zustand";
import { persist } from "zustand/middleware";

import { clearProductDataCaches } from "@/utils/products/productDataCache";
import { useProductChangesStore } from "./useProductChangesStore";

interface IUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  image: string;
}

type ICredentials = {
  accessToken: string;
  refreshToken: string;
};

interface IUserState {
  user: IUser | null;
  credentials: ICredentials | null;

  isInitializing: boolean;

  setUser: (user: IUser) => void;
  setCredentials: (credentials: ICredentials) => void;
  setInitializing: (value: boolean) => void;
  removeCredentials: () => void;
}

type IPersistedUserState = Pick<IUserState, "user" | "credentials">;

const userStoreSlice: StateCreator<IUserState> = (set, get) => ({
  user: null,
  credentials: null,
  isInitializing: true,

  setUser: (user) => {
    if (get().user?.id !== user.id) {
      clearProductDataCaches();
      useProductChangesStore.getState().clearProductChanges();
    }

    set({ user });
  },

  setCredentials: (credentials) => set({ credentials }),

  setInitializing: (value) => set({ isInitializing: value }),

  removeCredentials: () => {
    clearProductDataCaches();
    useProductChangesStore.getState().clearProductChanges();

    set({
      user: null,
      credentials: null,
    });
  },
});

const persistedUserStore = persist<IUserState, [], [], IPersistedUserState>(
  userStoreSlice,
  {
    name: "user",

    partialize: (state) => ({
      user: state.user,
      credentials: state.credentials,
    }),
  },
);

export const useUserStore = create(persistedUserStore);
