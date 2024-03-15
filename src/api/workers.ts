import api from "../api";

export function getWorkers() {
  return api.get("/load-workers");
}