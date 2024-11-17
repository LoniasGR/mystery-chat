import React, { useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const MessageContent: MessageContentComponent = ({ message, isYou }) => {
  console.log(message);
  return (
    <div
      className={`py-2 px-3 rounded-lg ${
        isYou
          ? "bg-primary text-primary-foreground self-end"
          : "bg-muted self-start"
      }`}
    >
      <div className="break-words whitespace-pre-line">{message}</div>
    </div>
  );
};

interface MessageContentComponent extends React.FC<MessageContentProps> {
  Skeleton: React.FC;
}

type MessageContentProps = {
  message: string;
  isYou: boolean;
};

const MessageContentSkeleton = () => {
  const style = useRef({
    height: `${getRandomSkeletonHeight()}px`,
    width: `${Math.floor(Math.random() * (500 - 100 + 1)) + 100}px`,
  });
  return <Skeleton className="rounded-lg" style={style.current} />;
};

MessageContent.Skeleton = MessageContentSkeleton;

function getRandomSkeletonHeight() {
  const values = [40, 40, 40, 80, 120];
  return values[Math.floor(Math.random() * values.length)];
}

export default MessageContent;
