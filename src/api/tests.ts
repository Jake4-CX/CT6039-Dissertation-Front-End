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

export function startTest(id: string) {
  return api.get(`/load-tests/${id}/start`);
}

export function stopTest(id: string) {
  return api.get(`/load-tests/${id}/stop`);
}