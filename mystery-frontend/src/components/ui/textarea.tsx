import * as React from "react";
import TextareaAutosize from "react-textarea-autosize";

import { cn } from "@/lib/utils";

export type TextareaProps =
  | (TextAreaProps & {
      autoSize?: false;
    })
  | (TextAreaAutosizeProps & { autoSize: true });

type TextAreaAutosizeProps = React.ComponentProps<typeof TextareaAutosize>;
type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoSize = false, ...props }, ref) => {
    const _className = cn(
      "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-md shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      className
    );

    if (autoSize) {
      return (
        <TextareaAutosize
          ref={ref}
          className={_className}
          {...(props as TextAreaAutosizeProps)}
        />
      );
    }

    return <textarea ref={ref} className={_className} {...props} />;
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
