// File Path: src/hooks/useDebounce.ts

import { useState, useEffect } from "react";

// T is a generic type for the value being debounced
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Rerun effect only if value or delay changes

  return debouncedValue;
}

export default useDebounce;
