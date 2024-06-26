// Credits to excalidraw
import "./stack.scss";

import React, { forwardRef } from "react";
import clsx from "classnames";

type StackProps = {
  children: React.ReactNode;
  gap?: number;
  align?: "start" | "center" | "end" | "baseline";
  justifyContent?: "center" | "space-around" | "space-between";
  className?: string | boolean;
  style?: React.CSSProperties;
  ref: React.RefObject<HTMLDivElement>;
};

const RowStack = forwardRef(
  (
    { children, gap, align, justifyContent, className, style }: StackProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <div
        className={clsx("stack stack_horizontal", className)}
        style={{
          "--gap": gap,
          alignItems: align,
          justifyContent,
          ...style,
        }}
        ref={ref}
      >
        {children}
      </div>
    );
  },
);

const ColStack = forwardRef(
  (
    { children, gap, align, justifyContent, className, style }: StackProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <div
        className={clsx("stack stack_vertical", className)}
        style={{
          "--gap": gap,
          justifyItems: align,
          justifyContent,
          ...style,
        }}
        ref={ref}
      >
        {children}
      </div>
    );
  },
);

export default {
  Row: RowStack,
  Col: ColStack,
};
