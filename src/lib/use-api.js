import { useState, useEffect, useCallback } from "react";

export function useApiQuery({ queryFn, enabled = true, deps = [] }) {
  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [refetchIndex, setRefetchIndex] = useState(0);

  const refetch = useCallback(() => {
    setRefetchIndex((i) => i + 1);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setIsError(false);
    setError(null);

    Promise.resolve()
      .then(() => queryFn())
      .then((res) => {
        if (isMounted) {
          setData(res);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setIsError(true);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [enabled, refetchIndex, ...deps]);

  return { data, isLoading, isError, error, refetch };
}

export function useApiMutation({ mutationFn, onSuccess, onError, onMutate }) {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (variables) => {
      setIsPending(true);
      let context;
      try {
        if (onMutate) {
          context = await onMutate(variables);
        }
        const result = await mutationFn(variables);
        setIsPending(false);
        if (onSuccess) {
          onSuccess(result, variables, context);
        }
        return result;
      } catch (err) {
        setIsPending(false);
        if (onError) {
          onError(err, variables, context);
        }
      }
    },
    [mutationFn, onSuccess, onError, onMutate],
  );

  return { mutate, isPending };
}
