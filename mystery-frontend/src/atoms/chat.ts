import { atom } from "jotai";
import { v4 as uuid } from "uuid";

import type { Message } from "@/common/types";

export const messagesAtom = atom<Message[]>([]);
export const typingUsersAtom = atom<Set<string>>(new Set<string>());

export const storeNewMessageAtom = atom(
  null,
  (_get, set, content: string, username: string) => {
    const newMessage: Message = {
      _id: uuid(),
      timestamp: new Date().toISOString(),
      content,
      user: {
        _id: username,
      },
    };

    set(messagesAtom, (prev) => [...prev, newMessage]);
    return newMessage;
  }
);

export const startUserTypingAtom = atom(null, (_get, set, username: string) => {
  set(typingUsersAtom, (users) =>
    users.has(username) ? users : new Set([...users, username])
  );
});

export const stopUserTypingAtom = atom(null, (_get, set, username: string) => {
  set(typingUsersAtom, (users) => {
    if (!users.has(username)) {
      return users;
    }

    const newSet = new Set(users);
    newSet.delete(username);
    return newSet;
  });
});
