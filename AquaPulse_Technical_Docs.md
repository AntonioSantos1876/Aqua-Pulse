# Aqua-Pulse: Smart Aquaculture Management System
## Final Year Project Technical Documentation
**Author:** Michael Antonio Crawford  
**Date:** April 6, 2026  
**Project Scope:** Mechatronics, IoT, and Digital Control Systems

---

## 1. Executive Summary
Aqua-Pulse is a state-of-the-art aquaculture management platform designed to automate and optimize feeding processes in commercial fish farms. By integrating mechatronic hardware simulation with a high-fidelity mobile control interface, the system reduces feed wastage, monitors environmental hazards, and provides real-time telemetry for remote fleet management.

### The Problem
Traditional aquaculture relies on manual feeding or "dumb" timers, leading to:
- Significant feed waste (over 20% in some cases) due to non-adaptive cycles.
- High labor costs for manual inspections.
- Undetected equipment failures (clogs, battery death, storm damage).

### The Aqua-Pulse Solution
A networked fleet of smart feeders that communicate via long-range (LoRa/Cellular) protocols back to a centralized operator dashboard, allowing for precision feeding and preventative maintenance.

---

## 2. System Architecture

The Aqua-Pulse ecosystem is divided into three primary layers:

### A. Frontend (Mobile & Digital Interface)
- **Framework**: Built with **React Native (Expo SDK 51)** for cross-platform availability.
- **Routing**: **Expo Router** (File-based routing) ensures a scalable navigation profile.
- **UI/UX**: Custom design system using **Vanilla CSS** and **Linear Gradients**, with **Moti** and **Reanimated** for performance-optimized animations.
- **Onboarding**: Native permission handling for **Location Services** (system mapping) and **Push Notifications** (critical alerts).

### B. The Digital Twin / Simulation Engine
To demonstrate mechatronic behavior without physical hardware present during the demo, the app contains a high-fidelity **Simulation Engine**:
- **Logic Location**: `store/feederStore.ts`.
- **Telemetry Loop**: A `setInterval` pulse (every 1.5s) that computes real-time physics:
    - **Solar Charging**: Batteries gain voltage (+0.01V/tick) when idle.
    - **Motor Load**: Batteries discharge during dispense cycles.
    - **Material Physics**: Feed levels deplete based on gate position and dispense duration.
    - **Environmental Noise**: Random-walk algorithms simulate wave-induced "tilt" and signal interference.

### C. Data & State Management
- **Central Store**: **Zustand** manages the entire fleet state. This ensures that a battery drop on a specific feeder is instantly reflected on the dashboard, the list view, and the alerts badge simultaneously.
- **Persistence**: **Expo SecureStore** saves sessions and onboarding data locally on the device.

---

## 3. Core Features & Smart Logic

### I. Precision Feeding Cycles
The "Feed Sequence" follows an industrial PLC logic flow:
`IDLE` → `PRECHECK` (Safety) → `SPINUP` (Motor start) → `DISPENSE` (Gate open) → `CLEARING` (Reverse/Clear) → `COMPLETE`.

### II. Automated Refill Logic (Delta Feeder)
For demonstration purposes, the system includes an autonomous refill simulation:
- When a feeder detects `0%` feed level, it triggers a `CRITICAL` alert.
- It enters a mandatory `FAULT` state for safety.
- After a simulated refill delay, the system "replenishes" the hopper and resumes the schedule automatically.

### III. Safety & Interlocks
- **E-Stop**: Remote emergency stop capability halts all motor operations instantly.
- **Lid Sensor**: Physical interlock logic—if the hopper lid is opened, the system enters an `ESTOP` state to protect the operator from moving parts.
- **Tilt Critical**: Accelerometer sensing to detect if a feeder has capsized or is at a dangerous angle.

---

## 4. Technical Specifications
- **Programming Language:** TypeScript (Strict Mode).
- **Communication Protocol:** Simulated LoRaWAN (868/915 MHz profile) for long-range, low-power telemetry.
- **Version:** v2.0.1 (Stable).
- **Security:** Integrated Terms of Service & Privacy Policy screens with context-aware navigation.

---

## 5. Future Roadmap
1.  **AI Biomass Estimation**: Using computer vision to calculate fish mass and automatically adjust feed volume.
2.  **Autonomous Fleet Optimization**: Feeders moving within the cage using thrusters to ensure even feed distribution.
3.  **Predictive Maintenance**: ML models predicting motor failure based on current draw fluctuations.

---
*This documentation is part of the Aqua-Pulse Final Year Project submission.*
