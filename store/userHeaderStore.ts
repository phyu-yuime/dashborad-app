import { create } from "zustand";

type HeaderState = {
  isLoggedIn: boolean;
  setisLoggedIn: (value: boolean) => void;
};

export const useHeaderStore = create<HeaderState>((set) => ({
  isLoggedIn: false,
  setisLoggedIn: (value) =>
    set({
      isLoggedIn: value,
    }),
}));
