import { useState, useEffect, useCallback } from "react";
import { weatherService } from "../services/weatherService";

/**
 * Fetches API usage stats, plan limits, and billing period.
 *
 * @returns {{ data, loading, error, refetch }}
 */
export function useUsage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await weatherService.getUsage());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
