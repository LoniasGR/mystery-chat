import React from "react";
import UserAvatar from "@/components/ui/user-avatar";
import useTimeFormat from "@/hooks/useTimeFormat";

import type { Message, MessageMeta as MessageMetaType } from "@/types";

const Message: React.FC<Message> = ({ content, meta }) => {
  const { name, avatar, timestamp } = meta;
  const isYou = meta.name === "Prince Olive"; // todo

  return (
    <div
      className={`flex gap-3 max-w-[85%] sm:max-w-[min(80%, 550px)] ${
        isYou ? "self-end ml-8" : "self-start mr-8"
      }`}
    >
      {!isYou && <UserAvatar name={name} src={avatar} className="h-8 w-8" />}
      <div className="flex flex-col gap-1">
        <MessageMeta timestamp={timestamp} name={name} isYou={isYou} />
        <MessageContent message={content} isYou={isYou} />
      </div>
    </div>
  );
};

const MessageMeta: React.FC<MessageMetaProps> = ({
  timestamp,
  name,
  isYou,
}) => {
  const messageTime = useTimeFormat(timestamp);

  return (
    <div
      className={`text-xs flex gap-1 ${
        isYou ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <strong>{isYou ? "You" : name}</strong>
      <span className="text-muted-foreground">•</span>
      <span className="text-muted-foreground">{messageTime}</span>
    </div>
  );
};

const MessageContent: React.FC<MessageContentProps> = ({ message, isYou }) => {
  return (
    <div
      className={`py-2 px-3 rounded-lg ${
        isYou ? "bg-primary text-primary-foreground" : "bg-muted"
      }`}
    >
      <div className="break-words">{message}</div>
    </div>
  );
};

type MessageMetaProps = Omit<MessageMetaType, "avatar" | "id"> & {
  isYou: boolean;
};

type MessageContentProps = {
  message: string;
  isYou: boolean;
};

export default Message;
