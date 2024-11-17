// @ts-expect-error this import is correct
import Wine from "@/assets/wine.svg?react";

const Loader = ({ className = "", isAnimating = true }) => (
  <div className="self-center">
    <Wine
      className={`h-6 w-6 fill-muted-foreground ${className}${
        isAnimating ? " animate-pulse" : ""
      }`}
    />
  </div>
);

export default Loader;
