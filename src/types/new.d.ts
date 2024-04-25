interface ViewLoadTestModal {
  test: LoadTestModel,
  testMetrics: Map<number, Map<number, ResponseFragment[]>>
}

interface ResponseFragment {
  statusCode: number;
  responseTime: number;
}

interface LoadTestModel {
  id: number,
  uuid: string,
  name: string,
  testPlan: LoadTestPlanModel
  loadTests: LoadTestTestsModel[],
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null
}

interface LoadTestPlanModel {
  id: number,
  loadTestModelId: number,
  reactFlowPlan: string,
  testPlan: string,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null
}

interface LoadTestTestsModel {
  id: number,
  loadTestModelId: number,
  duration: number,
  virtualUsers: number,
  state: "PENDING" | "RUNNING" | "COMPLETED" | "CANCELLED",
  loadTestType: "LOAD" | "STRESS" | "SPIKE" | "SOAK",
  testMetrics: LoadTestMetricsModel,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null
}

interface LoadTestMetricsModel {
  id: number,
  loadTestTestsModelId: number,
  totalRequests: number,
  successfulRequests: number,
  failedRequests: number,
  totalResponseTime: number,
  averageResponseTime: number,
  loadTestHistory?: LoadTestHistoryModel,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null
}

interface LoadTestHistoryModel {
  id: number,
  loadTestMetricModelId: number,
  testHistory: string, // JSON string
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null
}

interface TestHistoryFragment {
  requests: number,
  averageResponseTime: number
}

// Socket.IO

type TestMetricsEmit = {
  test: LoadTestTestsModel,
  testMetrics: TestMetricsSlice,
  elapsedSeconds: number
}