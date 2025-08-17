import React, { useEffect, useRef } from "react";

export default function AutoPlay({ enabled, interval = 1000, onAttack }) {
  const intervalRef = useRef(null);

  useEffect(() => {
    if (enabled && typeof onAttack === "function") {
      intervalRef.current = setInterval(() => {
        onAttack();
      }, interval);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [enabled, interval, onAttack]);

  return null; // kein UI
}
