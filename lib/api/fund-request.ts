import { api } from "../axios";

export const getFundRequestsMeAPI = async () => {
  return await api.get("/fund-request/me");
};

export const createFundRequestAPI = async (payload: any) => {
  return await api.post("/fund-request", payload);
};

export const getAllFundRequestsAPI = async () => {
  return await api.get("/fund-request");
};

export const approveFundRequestAPI = async (id: string) => {
  return await api.patch(`/fund-request/${id}/approve`);
};

export const rejectFundRequestAPI = async (id: string) => {
  return await api.patch(`/fund-request/${id}/reject`);
};
