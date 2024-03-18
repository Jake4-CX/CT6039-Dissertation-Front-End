import { ReactFlowJsonObject } from "reactflow";
import api from "../api";

export function getTests() {
  return api.get("/load-tests");
}

export function getTestById(id: string) {
  return api.get(`/load-tests/${id}`);
}

export function createTest(data: any) {
  return api.post("/load-tests", data);
}

export function deleteTest(id: string) {
  return api.delete(`/load-tests/${id}`);
}

export function startTest(id: string) {
  return api.get(`/load-tests/${id}/start`);
}

export function stopTest(id: string) {
  return api.get(`/load-tests/${id}/stop`);
}

export function updateTestPlan(data: { id: string, testPlan: TreeNode[], reactFlow: ReactFlowJsonObject<unknown, unknown> }) {
  return api.put(`/load-tests/${data.id}/plan`, {
    testPlan: data.testPlan,
    reactFlow: data.reactFlow
  });
}