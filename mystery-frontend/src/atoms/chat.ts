import { atom } from "jotai";
import { type UUID } from "crypto";

import type { Message } from "@/types";

// todo: change this to a browser-compatible UUID library
function randomUUID(): UUID {
  if (window.isSecureContext) {
    return crypto.randomUUID();
  }

  // Should never be seen in production
  const dater = new Date().toISOString();
  return `1-2-3-4-${dater}`;
}

export const messagesAtom = atom<Message[]>([]);
export const typingUsersAtom = atom<Set<string>>(new Set<string>());

export const storeNewMessageAtom = atom(
  null,
  (_get, set, content: string, username: string) => {
    const newMessage: Message = {
      _id: randomUUID(),
      timestamp: new Date().toISOString(),
      content,
      user: {
        nickname: username,
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
