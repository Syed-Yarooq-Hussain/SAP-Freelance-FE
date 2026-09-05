"use client";

import colors from "@/utils/styles/colors";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import LoaderBackdrop from "./LoaderBackdrop";

export default function GlobalLoader() {
  const fetching = useIsFetching();
  const mutating = useIsMutating();

  const shouldOpen = fetching > 0 || mutating > 0;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (shouldOpen) {
      timer = setTimeout(() => setOpen(true), 180);
    } else {
      setOpen(false);
    }

    return () => clearTimeout(timer);
  }, [shouldOpen]);

  return <LoaderBackdrop open={open} color={colors.BLUE} />;
}
