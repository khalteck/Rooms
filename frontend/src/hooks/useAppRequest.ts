import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  UseQueryOptions,
  UseMutationOptions,
  UseInfiniteQueryOptions,
  InfiniteData,
} from "@tanstack/react-query";
import { appRequest } from "../helpers/AppRequest";
import { AxiosRequestConfig } from "axios";

interface UseAppRequestOptions<TData = any> extends Omit<
  UseQueryOptions<TData, Error>,
  "queryKey" | "queryFn"
> {
  showError?: boolean;
  showSuccess?: boolean;
  successMessage?: string;
}

interface UseAppMutationOptions<TData = any, TVariables = any> extends Omit<
  UseMutationOptions<TData, Error, TVariables>,
  "mutationFn"
> {
  showError?: boolean;
  showSuccess?: boolean;
  successMessage?: string;
}

/**
 * Hook for GET requests using TanStack Query
 */
export function useAppQuery<TData = any>(
  key: string | string[],
  url: string,
  config?: AxiosRequestConfig,
  options?: UseAppRequestOptions<TData>,
) {
  const queryKey = Array.isArray(key) ? key : [key];

  return useQuery<TData, Error>({
    queryKey,
    queryFn: () =>
      appRequest.get<TData>(url, {
        ...config,
        showError: options?.showError,
        showSuccess: options?.showSuccess,
        successMessage: options?.successMessage,
      }),
    ...options,
  });
}

/**
 * Hook for POST requests using TanStack Query mutation
 */
export function useAppPost<TData = any, TVariables = any>(
  url: string,
  config?: AxiosRequestConfig,
  options?: UseAppMutationOptions<TData, TVariables>,
) {
  return useMutation<TData, Error, TVariables>({
    mutationFn: (data: TVariables) =>
      appRequest.post<TData>(url, data, {
        ...config,
        showError: options?.showError,
        showSuccess: options?.showSuccess,
        successMessage: options?.successMessage,
      }),
    ...options,
  });
}

/**
 * Hook for PUT requests using TanStack Query mutation
 */
export function useAppPut<TData = any, TVariables = any>(
  url: string,
  config?: AxiosRequestConfig,
  options?: UseAppMutationOptions<TData, TVariables>,
) {
  return useMutation<TData, Error, TVariables>({
    mutationFn: (data: TVariables) =>
      appRequest.put<TData>(url, data, {
        ...config,
        showError: options?.showError,
        showSuccess: options?.showSuccess,
        successMessage: options?.successMessage,
      }),
    ...options,
  });
}

/**
 * Hook for PATCH requests using TanStack Query mutation
 */
export function useAppPatch<TData = any, TVariables = any>(
  url: string,
  config?: AxiosRequestConfig,
  options?: UseAppMutationOptions<TData, TVariables>,
) {
  return useMutation<TData, Error, TVariables>({
    mutationFn: (data: TVariables) =>
      appRequest.patch<TData>(url, data, {
        ...config,
        showError: options?.showError,
        showSuccess: options?.showSuccess,
        successMessage: options?.successMessage,
      }),
    ...options,
  });
}

/**
 * Hook for DELETE requests using TanStack Query mutation
 */
export function useAppDelete<TData = any, TVariables = any>(
  url: string | ((variables: TVariables) => string),
  config?: AxiosRequestConfig,
  options?: UseAppMutationOptions<TData, TVariables>,
) {
  return useMutation<TData, Error, TVariables>({
    mutationFn: (variables: TVariables) => {
      const deleteUrl = typeof url === "function" ? url(variables) : url;
      return appRequest.delete<TData>(deleteUrl, {
        ...config,
        showError: options?.showError,
        showSuccess: options?.showSuccess,
        successMessage: options?.successMessage,
      });
    },
    ...options,
  });
}

/**
 * Generic mutation hook that can be used for any HTTP method
 */
export function useAppMutation<TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseAppMutationOptions<TData, TVariables>,
) {
  return useMutation<TData, Error, TVariables>({
    mutationFn,
    ...options,
  });
}

/**
 * Hook for infinite scroll queries with cursor-based pagination
 */
export function useAppInfiniteQuery<TData = any>(
  key: string | string[],
  url: string,
  config?: AxiosRequestConfig,
  options?: Omit<
    UseInfiniteQueryOptions<
      TData,
      Error,
      InfiniteData<TData, unknown>,
      string[],
      string | undefined
    >,
    "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
  > & {
    showError?: boolean;
    getNextPageParam?: (lastPage: TData) => string | undefined;
  },
) {
  const queryKey = Array.isArray(key) ? key : [key];

  return useInfiniteQuery<
    TData,
    Error,
    InfiniteData<TData, unknown>,
    string[],
    string | undefined
  >({
    queryKey,
    queryFn: ({ pageParam }) =>
      appRequest.get<TData>(url, {
        ...config,
        params: {
          ...config?.params,
          cursor: pageParam,
        },
        showError: options?.showError,
      }),
    getNextPageParam: options?.getNextPageParam || (() => undefined),
    initialPageParam: undefined,
    ...options,
  });
}
