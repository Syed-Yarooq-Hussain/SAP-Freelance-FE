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
    let timer: NodeJS.Timeout;

    if (shouldOpen) {
      setOpen(true);
    } else {
      timer = setTimeout(() => setOpen(false), 300);
    }

    return () => clearTimeout(timer);
  }, [shouldOpen]);

  return <LoaderBackdrop open={open} color={colors.BLUE} />;
}
