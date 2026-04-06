// services/simulationEngine.ts
// This service is kept for backward compatibility but the simulation
// is now handled directly inside feederStore.ts via tickSimulation().
// The root layout still imports this so we export safe no-ops.

export function startSimulationEngine(): void {
  // Simulation is handled by the setInterval inside feederStore.ts
  // Nothing to do here — kept to avoid breaking the _layout.tsx import.
}

export function stopSimulationEngine(): void {
  // No-op — the store's interval runs for the app lifetime.
}
