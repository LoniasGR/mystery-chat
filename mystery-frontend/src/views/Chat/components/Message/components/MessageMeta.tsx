import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTimeFormat } from "@/hooks/time";

import type { Message, User } from "@/types";

const MessageMeta: MessageMetaComponent = ({ timestamp, name, isYou }) => {
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

const MessageMetaSkeleton = () => {
  return (
    <div className="text-xs flex gap-1">
      <Skeleton className="w-20 h-4 rounded-sm" />
      <Skeleton className="w-2 h-4 rounded-sm" />
      <Skeleton className="w-10 h-4 rounded-sm" />
    </div>
  );
};

interface MessageMetaComponent extends React.FC<MessageMetaProps> {
  Skeleton: React.FC;
}

type MessageMetaProps = {
  timestamp: Message["timestamp"];
  name: User["nickname"];
  isYou: boolean;
};

MessageMeta.Skeleton = MessageMetaSkeleton;

export default MessageMeta;
