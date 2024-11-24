import type { Message } from "@/common/types";

export type MessageWithStatus = Message & {
  status?: MessageStatus;
};

export type MessageStatus = "pending" | "sent" | "failed";
