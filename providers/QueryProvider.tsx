"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { FC } from "react";
interface IQueryProviderProps {
  children: React.ReactNode;
}
const QueryProvider: FC<IQueryProviderProps> = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
