import { atom } from "jotai";
import { v4 as uuid } from "uuid";

import type { MessageWithStatus, MessageStatus } from "@/lib/types";

export const messagesAtom = atom<MessageWithStatus[]>([]);
export const typingUsersAtom = atom<Set<string>>(new Set<string>());

export const storeNewMessageAtom = atom(
  null,
  (_get, set, content: string, username: string) => {
    const newMessage: MessageWithStatus = {
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

export const updateMessageStatusAtom = atom(
  null,
  (_get, set, messageId: string, status: MessageStatus) => {
    set(messagesAtom, (prev) => {
      const foundIdx = prev.findLastIndex(
        (message) => message._id === messageId
      );

      if (foundIdx === -1) {
        return prev;
      }

      const newMessages = [...prev];
      newMessages[foundIdx] = { ...newMessages[foundIdx], status };
      return newMessages;
    });
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
