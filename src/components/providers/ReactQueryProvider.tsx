"use client";

import { type FunctionComponent, type PropsWithChildren, Suspense, lazy, useEffect } from "react";
import { QueryClient, QueryClientProvider as ReactQueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRQDevtoolsInProd } from "../stores/useRQDevtoolsInProd";

const ReactQueryDevtoolsProduction = lazy(() =>
  import("@tanstack/react-query-devtools/build/modern/production.js").then((d) => ({
    default: d.ReactQueryDevtools,
  })),
);

const queryClient = new QueryClient();

export const ReactQueryProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  // const [queryClient] = useState(new QueryClient());

  const { show, toggleDevtools } = useRQDevtoolsInProd();

  useEffect(() => {
    // @ts-expect-error - this is a custom function
    window.toggleDevtools = () => toggleDevtools();
  }, [toggleDevtools, show]);

  return (
    <ReactQueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />

      {show && (
        <Suspense fallback={null}>
          <ReactQueryDevtoolsProduction />
        </Suspense>
      )}
    </ReactQueryClientProvider>
  );
};
