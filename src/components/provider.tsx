"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useMemo } from "react";
import { QueryProviderProps } from "@/schema/common";

const QueryProvider = ({ children }: QueryProviderProps) => {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProvider>
  );
};

export { QueryProvider };
