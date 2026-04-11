import { api } from "../axios";

export const getWithdrawalHistoryAPI = async (page: number = 1, limit: number = 10) => {
  return await api.get(`/withdrawal/me?page=${page}&limit=${limit}`);
};

export const createWithdrawalAPI = async (payload: any) => {
  return await api.post("/withdrawal", payload);
};

export const getAllWithdrawalsAPI = async (page: number = 1, limit: number = 10) => {
  return await api.get(`/withdrawal?page=${page}&limit=${limit}`);
};

export const getMemberRequestsAPI = async (page: number = 1, limit: number = 10) => {
  return await api.get(`/withdrawal/me?page=${page}&limit=${limit}`);
};

export const approveWithdrawalAPI = async (id: string) => {
  return await api.patch(`/withdrawal/${id}/approve`);
};

export const rejectWithdrawalAPI = async (id: string, payload?: any) => {
  return await api.patch(`/withdrawal/${id}/reject`, payload || {});
};

// export const updateWalletAPI = async (payload: any) => {
//   return await api.patch("/withdrawal", payload);
// };
