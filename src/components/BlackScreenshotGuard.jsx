// src/components/BlackScreenshotGuard.jsx
import { useEffect, useState } from "react";

const BlackScreenshotGuard = ({ children }) => {
  const [isBlocking, setIsBlocking] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key === "printscreen") {
        e.preventDefault(); 
        setIsBlocking(true);
        setTimeout(() => setIsBlocking(false), 800);
      }
      if (
        (e.metaKey && e.shiftKey && (key === "3" || key === "4")) ||
        (e.ctrlKey && key === "p")
      ) {
        e.preventDefault();
        setIsBlocking(true);
        setTimeout(() => setIsBlocking(false), 800);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setIsBlocking(true);
        setTimeout(() => setIsBlocking(false), 800);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="relative">
      {children}
      {isBlocking && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "black",
            zIndex: 99999,
          }}
        ></div>
      )}
    </div>
  );
};

export default BlackScreenshotGuard;
