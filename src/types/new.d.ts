interface LoadTestModel {
  id: string,
  uuid: string,
  name: string,
  state: "PENDING" | "RUNNING" | "COMPLETED" | "CANCELLED",
  testPlan: LoadTestPlanModel
  loadTests: LoadTestTestsModel,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null
}

interface LoadTestPlanModel {
  id: string,
  loadTestModelId: string,
  reactFlowPlan: string,
  testPlan: string,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null
}

interface LoadTestTestsModel {
  id: string,
  loadTestModelId: string,
  duration: number,
  virtualUsers: number,
  loadTestType: "LOAD" | "STRESS" | "SPIKE" | "SOAK",
  testMetrics: LoadTestMetricsModel,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null
}

interface LoadTestMetricsModel {
  id: string,
  loadTestTestsModelId: string,
  totalRequests: number,
  successfulRequests: number,
  failedRequests: number,
  totalResponseTime: number,
  averageResponseTime: number,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null
}