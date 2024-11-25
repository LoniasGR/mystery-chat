import React, { useRef, useCallback, useState, forwardRef, memo } from "react";
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
import gatsbyPoster from "@/assets/gatsbyPoster.webp";

const LoginTitle = memo(
  forwardRef<HTMLVideoElement, { entered: boolean }>(function LoginTitle(
    { entered },
    ref
  ) {
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
          ref={ref}
          playsInline
          muted
          preload="auto"
          controls={false}
          className="rounded-lg w-20 h-20"
          poster={gatsbyPoster}
        />
      </div>
    );
  })
);

export function LoginForm() {
  const gatsbyRef = useRef<HTMLVideoElement | null>(null);
  const [entered, setEntered] = useState(false);

  const enter = useCallback(async () => {
    setEntered(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    await gatsbyRef.current?.play();
    await new Promise((resolve) => setTimeout(resolve, 2200));
  }, [setEntered]);

  const { mutate: login, isPending, error } = useLoginMutation(enter);

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
        <LoginTitle ref={gatsbyRef} entered={entered} />
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
    <p className="text-[0.8rem] font-medium text-destructive brightness-200">
      {formatError(error)}
    </p>
  );
}
