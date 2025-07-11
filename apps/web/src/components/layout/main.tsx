import { cn } from "#lib/utils";
import React from "react";

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
  ref?: React.Ref<HTMLElement>;
}

export const Main = ({ fixed, ...props }: MainProps) => {
  return (
    <main
      className={cn(
        "peer-[.header-fixed]/header:mt-20",
        "px-4 py-6",
        fixed && "fixed-main flex flex-grow flex-col overflow-hidden",
      )}
      {...props}
    />
  );
};

Main.displayName = "Main";
