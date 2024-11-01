import React from "react";
import UserAvatar from "@/components/ui/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageMeta, MessageContent } from "./components";

import type { Message as MessageType } from "@/types";

const Message: MessageComponent = ({ content, meta }) => {
  const { name, avatar, timestamp } = meta;
  const isYou = meta.name === "Prince Olive"; // todo

  return (
    <div
      className={`flex gap-3 max-w-[85%] sm:max-w-[min(80%,550px)] ${
        isYou ? "self-end ml-8" : "self-start mr-8"
      }`}
    >
      {!isYou && <UserAvatar name={name} src={avatar} className="h-8 w-8" />}
      <div className="flex flex-col gap-1 w-full">
        <MessageMeta timestamp={timestamp} name={name} isYou={isYou} />
        <MessageContent message={content} isYou={isYou} />
      </div>
    </div>
  );
};

const MessageSkeleton = ({ isYou = false }) => {
  return (
    <div
      className={`flex gap-3 max-w-[85%] sm:max-w-[min(80%,550px)] ${
        isYou ? "self-end ml-8" : "self-start mr-8"
      }`}
    >
      {!isYou && <Skeleton className="min-h-8 min-w-8 h-8 w-8 rounded-full" />}
      <div
        className={`w-full flex flex-col gap-1 ${
          isYou ? "items-end" : "items-start"
        }`}
      >
        <MessageMeta.Skeleton />
        <MessageContent.Skeleton />
      </div>
    </div>
  );
};

interface MessageComponent extends React.FC<MessageType> {
  Skeleton: React.FC<{ isYou?: boolean }>;
}

Message.Skeleton = MessageSkeleton;

export default Message;
