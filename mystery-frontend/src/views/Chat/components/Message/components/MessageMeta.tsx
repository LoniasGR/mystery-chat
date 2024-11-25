import React from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { useTimeFormat } from "@/hooks/time";

import type { Message, User } from "@/common/types";
import type { MessageStatus } from "@/lib/types";

const MessageMeta: MessageMetaComponent = ({
  timestamp,
  name,
  isYou,
  status = "sent",
}) => {
  const messageTime = useTimeFormat(timestamp);

  return (
    <div
      className={`text-xs flex gap-1 items-center ${
        isYou ? "flex-row-reverse" : "flex-row"
      } ${
        status === "failed"
          ? "[&+*]:bg-destructive [&+*]:text-destructive-foreground"
          : ""
      }`}
    >
      <strong>{isYou ? "You" : name}</strong>
      <span className="text-muted-foreground">•</span>
      <span className="text-muted-foreground">{messageTime}</span>
      {status === "pending" && <MessageLoadingIndicator />}
      {status === "failed" && <MessageErrorIndicator />}
    </div>
  );
};

const MessageLoadingIndicator = () => (
  <ReloadIcon className="w-3 h-3 text-muted-foreground animate-spin" />
);

const MessageErrorIndicator = () => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <ReloadIcon className="h-3 w-3 animate-spin text-destructive brightness-200" />
      </TooltipTrigger>
      <TooltipContent className="bg-destructive text-destructive-foreground">
        <p>
          We couldn't get a confirmation that your message has been sent.
          <br />
          This indicates network issues.
          <br />
          Please wait or try again soon.
        </p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

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
  name: User["_id"];
  isYou: boolean;
  status?: MessageStatus;
};

MessageMeta.Skeleton = MessageMetaSkeleton;

export default MessageMeta;
