import { forwardRef } from "react";
// @ts-expect-error this import is correct
import Wine from "@/assets/wine.svg?react";

type LoaderProps = {
  className?: string;
  isAnimating?: boolean;
};

const Loader = forwardRef<HTMLDivElement, LoaderProps>(
  ({ className = "", isAnimating = true }, ref) => (
    <div ref={ref} className="self-center">
      <Wine
        className={`h-6 w-6 fill-muted-foreground ${className}${
          isAnimating ? " animate-pulse" : ""
        }`}
      />
    </div>
  )
);

Loader.displayName = "Loader";

export default Loader;
