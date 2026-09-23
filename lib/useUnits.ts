"use client";

import { useEffect, useState } from "react";
import { fetchWithTimeout } from "./fetchWithTimeout";
import { UnitSystem } from "./units";

export function useUnits() {
  const [units, setUnitsState] = useState<UnitSystem>("metric");

  useEffect(() => {
    fetchWithTimeout("/api/settings")
      .then((r) => r.json())
      .then((res) => {
        if (res.units === "imperial") setUnitsState("imperial");
      })
      .catch(() => {});
  }, []);

  function setUnits(next: UnitSystem) {
    setUnitsState(next);
    fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ units: next }),
    }).catch(() => {});
  }

  return { units, setUnits };
}
