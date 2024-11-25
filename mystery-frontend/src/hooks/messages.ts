import { useCallback, useEffect, useRef, useState } from "react";
import { useSetAtom, useAtom, useAtomValue } from "jotai";
import { v4 as uuid } from "uuid";
import {
  messagesAtom,
  storeNewMessageAtom,
  updateMessageStatusAtom,
} from "@/atoms/chat";
import { notificationVariantAtom } from "@/atoms/notifications";
import socket from "@/lib/socket";
import { formatError } from "@/lib/errors";
import * as Notifications from "@/lib/notifications";
import { toast } from "./toast";
import { useUsername } from "./auth";

import type { Message, MessageCallbackParams } from "@/common/types";

const FAILED_MESSAGE_TIMEOUT = 10000;
const PENDING_MESSAGE_TIMEOUT = 1000;

export function useSendMessage() {
  const username = useUsername();
  const storeMessage = useSetAtom(storeNewMessageAtom);
  const updateMessageStatus = useSetAtom(updateMessageStatusAtom);

  return useCallback(
    (message: string) => {
      const { user, status, ...newMessage } = storeMessage(message, username);
      let hasAnyTimeoutExecuted = false;
      const noAckPendingTimeout = setTimeout(() => {
        updateMessageStatus(newMessage._id, "pending");
        hasAnyTimeoutExecuted = true;
      }, PENDING_MESSAGE_TIMEOUT);
      const noAckFailedTimeout = setTimeout(() => {
        updateMessageStatus(newMessage._id, "failed");
      }, FAILED_MESSAGE_TIMEOUT);
      socket.emit("messages:send", newMessage, () => {
        clearTimeout(noAckPendingTimeout);
        clearTimeout(noAckFailedTimeout);
        if (hasAnyTimeoutExecuted) {
          updateMessageStatus(newMessage._id, "sent");
        }
      });
    },
    [username, storeMessage, updateMessageStatus]
  );
}

// FUTURE: In case of an implementation of multiple chats, this hook could be refactored into atoms
// This probably could be refactored a tiny bit to allow using this hook from many places without messing up the Messages state but is good enough for our use case
export function useMessages({ manualFetch = false } = {}) {
  const notificationVariant = useAtomValue(notificationVariantAtom);

  const clientChatId = useRef<string | null>(null); // keeping integrity of the messages due to StrictMode re-rendering and emitting messages twice
  const [messages, setMessages] = useAtom(messagesAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryFullyLoaded, setIsHistoryFullyLoaded] = useState(false);

  const oldestMessageTimestamp = messages.at(0)?.timestamp;

  const handleMessagesHistory = useCallback(
    (data: MessageCallbackParams, chatId?: string) => {
      if (chatId && chatId !== clientChatId.current) {
        return;
      }

      if (data.status === "ERROR") {
        toast({
          title: "Oh no, we couldn't gather the whispers!",
          description: formatError(data.error),
          duration: 5000,
        });
        return;
      }
      const messages = data.data;

      if (messages.length > 0) {
        setMessages((prev) => [...messages, ...prev]);
      } else {
        setIsHistoryFullyLoaded(true);
      }
      setIsLoading(false);
    },
    [setMessages, setIsLoading, setIsHistoryFullyLoaded]
  );

  useEffect(() => {
    function handleMessageReceival(message: Message) {
      setMessages((prev) => [...prev, message]);
      if (notificationVariant === "sound") {
        Notifications.playSound();
        Notifications.vibrate();
      } else if (notificationVariant === "vibrate") {
        Notifications.vibrate();
      }
    }

    socket.on("messages:receive", handleMessageReceival);

    return () => {
      socket.off("messages:receive", handleMessageReceival);
    };
  }, [setIsLoading, setMessages, setIsHistoryFullyLoaded, notificationVariant]);

  const fetchMessages = useCallback(() => {
    if (isHistoryFullyLoaded) {
      return;
    }

    if (!clientChatId.current) {
      clientChatId.current = uuid();
    }

    setIsLoading(true);
    socket.emit(
      "messages:fetch",
      oldestMessageTimestamp ?? null,
      clientChatId.current,
      handleMessagesHistory
    );
  }, [
    oldestMessageTimestamp,
    setIsLoading,
    isHistoryFullyLoaded,
    handleMessagesHistory,
  ]);

  useEffect(() => {
    if (!manualFetch) {
      setIsLoading(true);
      clientChatId.current = uuid();
      socket.emit(
        "messages:fetch",
        null,
        clientChatId.current,
        handleMessagesHistory
      );
    }
  }, [manualFetch, setIsLoading, handleMessagesHistory]);

  return {
    fetchMessages,
    isFetching: isLoading,
    messages,
    isMoreToFetch: !isHistoryFullyLoaded,
  };
}
