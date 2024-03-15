interface LoadTest {
  ID: string,
  Name: string,
  State: "PENDING" | "RUNNING" | "CANCELLED" | "COMPLETED",
  CreatedAt: string,
  LastUpdatedAt: string,
  Metrics: {
    GlobalMetrics: {
      totalRequests: number,
      successfulRequests: number,
      failedRequests: number,
      totalResponseTime: number,
      averageResponseTime: number,
    },
    Metrics: undefined
  },
  LoadTestPlan: {
    URL: string,
    Duration: number,
    VirtualUsers: number
  }
}