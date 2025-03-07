import { QueryClient, QueryFunction } from "@tanstack/react-query";

interface ApiError extends Error {
  status?: number;
  details?: unknown;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const error: ApiError = new Error();
    error.status = res.status;
    
    try {
      const data = await res.json();
      error.message = data.message || res.statusText;
      error.details = data;
    } catch {
      error.message = await res.text() || res.statusText;
    }
    
    console.error(`API Error: ${res.status}`, error);
    throw error;
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  try {
    const res = await fetch(url, {
      method,
      headers: {
        ...(data ? { "Content-Type": "application/json" } : {}),
        "Accept": "application/json"
      },
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    console.error('API Request failed:', {
      method,
      url,
      error
    });
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey, signal }) => {
    try {
      const res = await fetch(queryKey[0] as string, {
        credentials: "include",
        signal,
        headers: {
          "Accept": "application/json"
        }
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      if (error instanceof Error) {
        console.error('Query failed:', {
          queryKey,
          error: error.message,
          stack: error.stack
        });
      }
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status && error.status >= 400 && error.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      onError: (error: any) => {
        console.error('Query error:', {
          status: error?.status,
          message: error?.message,
          details: error?.details
        });
      }
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Same retry logic as queries
        if (error?.status && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      onError: (error: any) => {
        console.error('Mutation error:', {
          status: error?.status,
          message: error?.message,
          details: error?.details
        });
      }
    },
  },
});
