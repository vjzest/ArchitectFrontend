import { useState, useEffect } from "react";

// This hook loads one or more external scripts dynamically
const useExternalScripts = (urls) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    const scripts = [];

    if (urls.length === 0) {
      setLoaded(true);
      return;
    }

    urls.forEach((url) => {
      // Prevent adding the same script multiple times
      if (document.querySelector(`script[src="${url}"]`)) {
        loadedCount++;
        if (loadedCount === urls.length) setLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src = url;
      script.async = true;

      script.onload = () => {
        loadedCount++;
        if (loadedCount === urls.length) {
          setLoaded(true);
        }
      };

      script.onerror = () => {
        console.error(`Failed to load script: ${url}`);
        setError(true);
      };

      document.body.appendChild(script);
      scripts.push(script);
    });

    return () => {
      // Cleanup script tags on component unmount
      scripts.forEach((script) => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      });
    };
  }, [urls]);

  return { loaded, error };
};

export default useExternalScripts;
