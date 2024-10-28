// @ts-expect-error this import is correct
import Wine from "@/assets/wine.svg?react";

const Loader = ({ className = "" }) => (
  <Wine
    className={`h-72 w-72 animate-pulse fill-muted-foreground self-center ${className}`}
  />
);

export default Loader;
