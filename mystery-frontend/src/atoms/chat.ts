import { atom } from "jotai";

import type { Message } from "@/types";

export const messagesAtom = atom<Message[]>([]);
export const typingUsersAtom = atom<Set<string>>(new Set<string>());

export const startUserTypingAtom = atom(null, (_get, set, username: string) => {
  set(typingUsersAtom, (users) => new Set([...users, username]));
});

export const stopUserTypingAtom = atom(null, (_get, set, username: string) => {
  set(typingUsersAtom, (users) => {
    const newSet = new Set(users);
    newSet.delete(username);
    return newSet;
  });
});
