import { useEffect, useState } from "react";

/**
 * Custom hook to debounce a value over a delay (default: 5000ms)
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default is 5000ms)
 * @returns {any} Debounced value
 */
function useDebounce(value, delay = 2000) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
