interface Worker {
  id: string,
  lastHearbeat: string,
  capabilities: {
    cpuUsage: number,
    totalMem: number,
    availableMem: number,
  },
  currentLoad: number,
  maxLoad: number,
  available: boolean
}