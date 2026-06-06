import { useState, useEffect, useCallback } from "react";
import { weatherService } from "../services/weatherService";

export function useWeather(coords, days = 7, units = "metric") {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await weatherService.getAll({
        latitude: coords?.lat,
        longitude: coords?.lon,
        days,
        units,
      });
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [coords?.lat, coords?.lon, days, units]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
