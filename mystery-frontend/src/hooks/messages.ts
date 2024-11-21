import { useCallback, useEffect, useRef, useState } from "react";
import { useSetAtom, useAtom } from "jotai";
import { v4 as uuid } from "uuid";
import { messagesAtom, storeNewMessageAtom } from "@/atoms/chat";
import socket from "@/lib/socket";
import { formatError } from "@/lib/errors";
import { toast } from "./toast";
import { useUsername } from "./auth";
import type { Message, MessageCallbackParams } from "@/common/types";

export function useSendMessage() {
  const username = useUsername();
  const storeMessage = useSetAtom(storeNewMessageAtom);

  return useCallback(
    (message: string) => {
      const { user, ...newMessage } = storeMessage(message, username);
      socket.emit("messages:send", newMessage);
    },
    [username, storeMessage]
  );
}

// FUTURE: In case of an implementation of multiple chats, this hook should be refactored into atoms, and each chat should come with its own jotai Provider
// This probably could be refactored a tiny bit to allow using this hook from many places without messing up the Messages state but is good enough for our use case
export function useMessages({ manualFetch = false } = {}) {
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
    }

    socket.on("messages:receive", handleMessageReceival);

    return () => {
      socket.off("messages:receive", handleMessageReceival);
    };
  }, [setIsLoading, setMessages, setIsHistoryFullyLoaded]);

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
