import { api } from "../axios";

export const adminLogin = async (data: any) => {
  const response = await api.post("/admin/login", data);
  return response.data;
};

export const adminRefresh = async () => {
  const response = await api.post("/admin/refresh");
  return response.data;
};
