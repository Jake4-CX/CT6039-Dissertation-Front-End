interface LoadTest {
  id: string,
  name: string,
  state: "PENDING" | "RUNNING" | "CANCELLED" | "COMPLETED",
  createdAt: string,
  lastUpdatedAt: string,
  metrics: {
    globalMetrics: {
      totalRequests: number,
      successfulRequests: number,
      failedRequests: number,
      totalResponseTime: number,
      averageResponseTime: number,
    },
    metrics: undefined
  },
  loadTestPlan: {
    url: string,
    duration: number,
    virtualUsers: number
  }
}