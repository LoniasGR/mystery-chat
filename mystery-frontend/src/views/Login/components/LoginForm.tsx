import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  memo,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/hooks/auth";
import { formatError } from "@/lib/errors";

import gatsbyVideo from "@/assets/gatsby.mp4";

const LoginTitle = memo(
  forwardRef(function LoginTitle(_props, ref) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [entered, setEntered] = useState(false);

    useImperativeHandle(ref, () => ({
      enter: async () => {
        setEntered(true);
        await new Promise((resolve) => setTimeout(resolve, 300));
        await videoRef.current?.play();
        await new Promise((resolve) => setTimeout(resolve, 2200));
      },
    }));

    return (
      <div className="flex justify-between items-start gap-2">
        <div>
          <div className="relative">
            <CardTitle
              className="text-2xl transition-opacity duration-700"
              style={{ opacity: entered ? "0" : "100" }}
            >
              Enter the mystery
            </CardTitle>
            <CardTitle
              className="text-2xl transition-opacity duration-1000 delay-700 absolute top-0 left-0"
              style={{ opacity: entered ? "100" : "0" }}
            >
              Welcome, friend!
            </CardTitle>
          </div>
          <CardDescription>
            Use your nickname and the received passphrase to login.
          </CardDescription>
        </div>
        <video
          src={gatsbyVideo}
          ref={videoRef}
          className="rounded-lg w-20 h-20"
        />
      </div>
    );
  })
);

export function LoginForm() {
  const titleRef = useRef<MysteryEntranceHandle>();
  const {
    mutate: login,
    isPending,
    error,
  } = useLoginMutation(titleRef.current?.enter);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const nickname = form.elements.namedItem("nickname") as HTMLInputElement;
    const password = form.elements.namedItem("password") as HTMLInputElement;

    return login({
      username: nickname.value,
      password: password.value,
    });
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <LoginTitle ref={titleRef} />
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="nickname">Nickname</Label>
            <Input id="nickname" placeholder="Mister Someone" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full" isLoading={isPending}>
            Enter
          </Button>
          <ErrorMessage error={error} />
        </form>
      </CardContent>
    </Card>
  );
}

function ErrorMessage({ error }: { error: Error | null }) {
  if (!error) {
    return null;
  }

  return (
    <p className="text-[0.8rem] font-medium text-destructive">
      {formatError(error)}
    </p>
  );
}

type MysteryEntranceHandle = {
  enter: () => Promise<void>;
};
