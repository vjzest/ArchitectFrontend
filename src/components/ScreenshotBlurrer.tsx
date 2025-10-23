import React, { useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";

const ScreenshotBlurrer = () => {
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isProtectionActiveRef = useRef(false);

  const activateProtection = useCallback(() => {
    if (isProtectionActiveRef.current) return;

    isProtectionActiveRef.current = true;
    document.body.classList.add("screenshot-protection-active");

    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }

    // Try to clear clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText("").catch(() => {});
    }

    blurTimeoutRef.current = setTimeout(() => {
      document.body.classList.remove("screenshot-protection-active");
      isProtectionActiveRef.current = false;
    }, 3000);
  }, []);

  useEffect(() => {
    document.body.classList.add("screenshot-protection");

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      toast.warning("Right-click disabled!");
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen - we can only detect, not prevent OS-level capture
      if (
        e.key === "PrintScreen" ||
        e.keyCode === 44 ||
        e.code === "PrintScreen"
      ) {
        activateProtection();
        toast.error(
          "Screenshot detected! Protected content will be blurred in capture.",
          {
            duration: 3000,
          }
        );
      }

      // Ctrl+P (Print)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        toast.error("Printing disabled!");
        return false;
      }

      // F12 (DevTools)
      if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
        toast.error("Developer tools disabled!");
        return false;
      }

      // Ctrl+Shift+I (DevTools)
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "i"
      ) {
        e.preventDefault();
        toast.error("Developer tools disabled!");
        return false;
      }

      // Ctrl+Shift+J (Console)
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "j"
      ) {
        e.preventDefault();
        toast.error("Console disabled!");
        return false;
      }

      // Ctrl+Shift+C (Inspect)
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "c"
      ) {
        e.preventDefault();
        toast.error("Inspect element disabled!");
        return false;
      }

      // Ctrl+U (View Source)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "u") {
        e.preventDefault();
        toast.error("View source disabled!");
        return false;
      }

      // Ctrl+S (Save)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        toast.error("Saving page disabled!");
        return false;
      }
    };

    // Key up listener for PrintScreen
    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        e.key === "PrintScreen" ||
        e.keyCode === 44 ||
        e.code === "PrintScreen"
      ) {
        // Screenshot likely taken, keep protection active
        activateProtection();
      }
    };

    const preventCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.warning("Copying disabled!");
    };

    const preventDrag = (e: DragEvent) => {
      e.preventDefault();
      toast.warning("Drag and drop disabled!");
    };

    // Event listeners
    document.addEventListener("contextmenu", handleContextMenu, {
      passive: false,
    });
    document.addEventListener("keydown", handleKeyDown, { passive: false });
    document.addEventListener("keyup", handleKeyUp, { passive: false });
    document.addEventListener("copy", preventCopy);
    document.addEventListener("dragstart", preventDrag);
    document.addEventListener("drop", preventDrag);

    return () => {
      document.body.classList.remove(
        "screenshot-protection",
        "screenshot-protection-active"
      );

      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }

      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("copy", preventCopy);
      document.removeEventListener("dragstart", preventDrag);
      document.removeEventListener("drop", preventDrag);
    };
  }, [activateProtection]);

  return null;
};

export default ScreenshotBlurrer;
