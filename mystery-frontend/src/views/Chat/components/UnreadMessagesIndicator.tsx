import React from "react";

const UnreadMessagesIndicator: React.FC<{ count: number }> = ({ count }) => {
  if (!count) {
    return;
  }

  return (
    <div className="absolute bottom-0 left-[50%] translate-x-[-50%] bg-primary">
      {count}
    </div>
  );
};

export default UnreadMessagesIndicator;
