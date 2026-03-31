import { api } from "../axios";

export const getMemberDashboardAPI = async () => {
  return await api.get("/dashboard");
};
