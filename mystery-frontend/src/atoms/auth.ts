import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const LOCAL_STORAGE_USERNAME_KEY = "mysterious-username";

export const usernameAtom = atomWithStorage<string | null>(
  LOCAL_STORAGE_USERNAME_KEY,
  null,
  undefined,
  { getOnInit: true }
);

export const isLoggedInAtom = atom((get) => get(usernameAtom) !== null);
