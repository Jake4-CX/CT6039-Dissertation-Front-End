interface Worker {
  ID: string,
  LastHearbeat: string,
  Capabilities: {
    CPUUsage: number,
    TotalMem: number,
    AvailableMem: number,
  },
  CurrentLoad: number,
  MaxLoad: number,
  Available: boolean
}