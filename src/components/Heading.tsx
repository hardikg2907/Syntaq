import React from "react";
import { cn } from "~/lib/utils";

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
}

const Heading = ({ children, className = "" }: HeadingProps) => {
  return (
    <h1
      className={cn(
        `text-3xl font-bold text-white underline underline-offset-1`,
        className,
      )}
    >
      {children}
    </h1>
  );
};

export default Heading;
