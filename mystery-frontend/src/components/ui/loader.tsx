// @ts-expect-error this import is correct
import Wine from "@/assets/wine.svg?react";

const Loader = ({ className = "" }) => (
  <div className="self-center">
    <Wine
      className={`h-6 w-6 animate-pulse fill-muted-foreground ${className}`}
    />
  </div>
);

export default Loader;
