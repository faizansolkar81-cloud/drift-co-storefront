// =============================================================
// Drift & Co. — Simple Hash Router
// A minimal client-side router using the URL hash (#/path).
// This avoids adding react-router as a dependency and keeps
// the project beginner-friendly. The router exposes the current
// path and a navigate() function to change pages.
// =============================================================
import { useEffect, useState, useCallback } from "react";

export function useHashRoute() {
  // Read the current hash path (defaults to "/")
  const [path, setPath] = useState(() => window.location.hash.slice(1) || "/");

  useEffect(() => {
    const onChange = () => setPath(window.location.hash.slice(1) || "/");
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  // Navigate to a new route by setting the hash
  const navigate = useCallback((to: string) => {
    window.location.hash = to;
    window.scrollTo(0, 0); // scroll to top on page change
  }, []);

  return { path, navigate };
}
