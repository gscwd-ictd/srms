import { RoleAbility } from "@srms/lib/authentication/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type UserState = {
  userDetails: RoleAbility;
  setUserDetails: (userDetails: RoleAbility) => void;
};

export const useUserStore = create<UserState>()(
  devtools((set) => ({
    userDetails: {} as RoleAbility,
    setUserDetails: (userDetails) => set({ userDetails }),
  })),
);
