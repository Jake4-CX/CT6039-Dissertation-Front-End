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
  loadTestModelId: string,
  reactFlowPlan: string,
  testPlan: string,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null
}

interface LoadTestTestsModel {
  id: number,
  loadTestModelId: string,
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

// Socket.IO

type TestMetricsEmit = {
  test: LoadTestTestsModel,
  testMetrics: TestMetricsSlice,
  elapsedSeconds: number
}