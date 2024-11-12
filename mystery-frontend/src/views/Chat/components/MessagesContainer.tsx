import React, { useCallback } from "react";
import { useMessages } from "@/hooks/messages";
import Loader from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import Message from "./Message";
import TypingIndicators from "./TypingIndicators";

function MessagesContainer() {
  const { messages, isFetching, isMoreToFetch, fetchMessages } = useMessages(); // todo: add some error handling
  const chatContainerRef = useAutoScrollDown();

  console.log({ messages, isFetching });
  if (!messages.length && isFetching) {
    return <MessagesContainerSkeleton />;
  }

  return (
    <div
      className="flex-1 p-4 flex flex-col gap-4 overflow-auto"
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
  );
}

// todo: auto fetch messages when reaching the top of the chat container + better styling
// todo: retain scroll position even after more messages have been loaded
const MessageFetcher: React.FC<
  Omit<ReturnType<typeof useMessages>, "messages">
> = ({ isFetching, isMoreToFetch, fetchMessages }) => {
  if (!isMoreToFetch) {
    return (
      <div className="text-xs text-gray-500 self-center">
        You've heard all the whispers
      </div>
    );
  }

  if (isFetching) {
    return <Loader />;
  }

  return (
    <Button onClick={fetchMessages} className="self-center" variant="ghost">
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

// todo: auto scroll down when a new message is sent by the user (always) or received (only when already scrolled down; otherwise show another indicator)
function useAutoScrollDown() {
  return useCallback((node: HTMLDivElement | null) => {
    if (node) {
      node.scrollTop = node.scrollHeight;
    }
  }, []);
}

export default MessagesContainer;
