"use client";

import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import LoaderBackdrop from "./LoaderBackdrop";

export default function GlobalLoader() {
  const fetching = useIsFetching();
  const mutating = useIsMutating();
  const open = fetching > 0 || mutating > 0;
  return <LoaderBackdrop open={open} />;
}
