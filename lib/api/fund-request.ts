import { api } from "../axios";

export const getFundRequestsMeAPI = async () => {
  return await api.get("/fund-request/me");
};

export const createFundRequestAPI = async (payload: any) => {
  return await api.post("/fund-request", payload);
};
