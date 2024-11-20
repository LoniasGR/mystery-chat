import { useState, useCallback } from "react";

export function useMutation<TData, TVariables = unknown, TError = Error>({
  mutationFn,
  onSuccess,
  onError,
}: UseMutationOptions<TData, TVariables, TError>): UseMutationResult<
  TData,
  TVariables,
  TError
> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<TError | null>(null);

  const mutate = useCallback(
    async (variables: TVariables) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await mutationFn(variables);
        setError(null);
        onSuccess?.(result, variables);
        return result;
      } catch (err) {
        const error = err as TError;
        setError(error);
        onError?.(error, variables);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFn, onSuccess, onError]
  );

  return {
    mutate,
    isPending: isLoading,
    error,
  };
}

type UseMutationOptions<TData, TVariables, TError> = {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: TError, variables: TVariables) => void;
};

type UseMutationResult<TData, TVariables, TError> = {
  mutate: (variables: TVariables) => Promise<TData>;
  isPending: boolean;
  error: TError | null;
};
