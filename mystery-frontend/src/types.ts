export type MessageMeta = {
  id: string;
  timestamp: string;
  name: string;
  avatar: string | undefined;
};

export type Message = {
  content: string;
  meta: MessageMeta;
};
