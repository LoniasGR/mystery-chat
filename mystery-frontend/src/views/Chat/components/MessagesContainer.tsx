import React, { useCallback, useLayoutEffect, useRef } from "react";
import { useMessages } from "@/hooks/messages";
import Loader from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { useUsername } from "@/hooks/auth";
import Message from "./Message";
import TypingIndicators from "./TypingIndicators";
import UnreadMessagesIndicator from "./UnreadMessagesIndicator";

import type { Message as MessageType } from "@/common/types";

function MessagesContainer() {
  const { messages, isFetching, isMoreToFetch, fetchMessages } = useMessages(); // todo: add some error handling
  const [chatContainerRef, unreadMessages] = useScrollOnNewMessage(messages);

  if (!messages.length && isFetching) {
    return <MessagesContainerSkeleton />;
  }

  return (
    <div className="flex-1 overflow-hidden relative">
      <div
        className="p-4 flex flex-col gap-4 overflow-auto h-full"
        ref={chatContainerRef}
      >
        <MessageFetcher
          isFetching={isFetching}
          isMoreToFetch={isMoreToFetch}
          fetchMessages={fetchMessages}
        />
        {messages?.map((message) => (
          <Message key={message._id} {...message} />
        ))}
        <TypingIndicators />
      </div>
      <UnreadMessagesIndicator count={unreadMessages} />
    </div>
  );
}

// todo: auto fetch messages when reaching the top of the chat container + better styling
// todo: retain scroll position even after more messages have been loaded
const MessageFetcher: React.FC<
  Omit<ReturnType<typeof useMessages>, "messages">
> = ({ isFetching, isMoreToFetch, fetchMessages }) => {
  if (!isMoreToFetch) {
    return (
      <div className="text-xs text-gray-500 self-center min-h-6">
        You've heard all the whispers
      </div>
    );
  }

  if (isFetching) {
    return <Loader />;
  }

  return (
    <Button onClick={fetchMessages} className="self-center h-6" variant="ghost">
      Load more whispers
    </Button>
  );
};

function MessagesContainerSkeleton() {
  return (
    <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden justify-end">
      {[...Array(14)].map((_, i) => (
        <Message.Skeleton key={i} isYou={i % 3 === 0} />
      ))}
    </div>
  );
}

function useScrollOnNewMessage(messages: MessageType[]) {
  const username = useUsername();
  const [newUnreadMessages, setNewUnreadMessages] = React.useState(0);

  const ref = useRef<HTMLDivElement | null>(null);
  const containerScrollHeight = useRef<number>(0);

  const previousFirstMessageId = useRef<string | null>(null);
  const previousLastMessageId = useRef<string | null>(null);
  const firstMessage = messages.at(0);
  const lastMessage = messages.at(-1);

  const updateScrollHeightRef = useCallback(() => {
    if (ref.current) {
      containerScrollHeight.current = ref.current.scrollHeight;
    }
  }, []);

  useLayoutEffect(() => {
    if (!firstMessage || !ref.current) {
      return;
    }

    if (previousFirstMessageId.current) {
      const scrollHeightDiff =
        ref.current.scrollHeight - containerScrollHeight.current;

      if (ref.current.scrollTop < scrollHeightDiff) {
        ref.current.scrollTop += scrollHeightDiff;
      }
    }

    previousFirstMessageId.current = firstMessage._id;
    updateScrollHeightRef();
  }, [firstMessage, updateScrollHeightRef]);

  useLayoutEffect(() => {
    if (!lastMessage || !ref.current) {
      return;
    }

    if (previousLastMessageId.current) {
      const isFullyScrolled =
        containerScrollHeight.current -
          ref.current.scrollTop -
          ref.current.clientHeight <
        1;
      const isSentByCurrentUser = lastMessage.user._id === username;

      if (isSentByCurrentUser || isFullyScrolled) {
        // todo: for some reason this doesn't work for the second condition!
        ref.current.scrollTop = ref.current.scrollHeight;
      }

      if (!isFullyScrolled && !isSentByCurrentUser) {
        setNewUnreadMessages((prev) => prev + 1);
      }
    }

    previousLastMessageId.current = lastMessage._id;
    updateScrollHeightRef();
  }, [lastMessage, updateScrollHeightRef, username]);

  return [
    useCallback((node: HTMLDivElement | null) => {
      if (node) {
        ref.current = node;
        node.scrollTop = node.scrollHeight;
      }
    }, []),
    newUnreadMessages,
  ] as const;
}

export default MessagesContainer;
