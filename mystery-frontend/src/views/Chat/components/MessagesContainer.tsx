import useMessages from "@/hooks/useMessages";
import Message from "./Message";

function MessagesContainer() {
  const { data, isLoading } = useMessages(); // todo: add params, and error handling
  return (
    <div className="flex-1 p-4 flex flex-col gap-4 overflow-auto">
      {isLoading && (
        <p className="text-center text-muted-foreground">Loading...</p>
      )}
      {data?.map((message) => (
        <Message key={message.meta.id} {...message} />
      ))}
    </div>
  );
}

export default MessagesContainer;
