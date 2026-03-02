import { api } from "../axios";

export const getWithdrawalHistoryAPI = async () => {
  return await api.get("/withdrawal/me");
};

export const createWithdrawalAPI = async (payload: any) => {
  return await api.post("/withdrawal", payload);
};

export const getAllWithdrawalsAPI = async () => {
  return await api.get("/withdrawal");
};

export const approveWithdrawalAPI = async (id: string) => {
  return await api.patch(`/withdrawal/${id}/approve`);
};

export const rejectWithdrawalAPI = async (id: string, payload?: any) => {
  return await api.patch(`/withdrawal/${id}/reject`, payload || {});
};

export const updateWalletAPI = async (payload: any) => {
  return await api.patch("/withdrawal", payload);
};
