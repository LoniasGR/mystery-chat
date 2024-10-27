import React, { useMemo } from "react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  type AvatarProps,
} from "@/components/ui/avatar";

const UserAvatar: React.FC<Props> = ({ name, src, ...props }) => {
  const fallback = useMemo(
    () =>
      name
        .split(" ")
        .map((n) => n[0])
        .join(""),
    [name]
  );

  return (
    <Avatar {...props}>
      <AvatarImage src={src} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
};

type Props = AvatarProps & {
  name: string;
  src: string | undefined;
};

export default UserAvatar;
