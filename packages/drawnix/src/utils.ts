import type { ResolutionType } from "./utility-types";

export const isPromiseLike = (
  value: any,
): value is Promise<ResolutionType<typeof value>> => {
  return (
    !!value &&
    typeof value === "object" &&
    "then" in value &&
    "catch" in value &&
    "finally" in value
  );
};