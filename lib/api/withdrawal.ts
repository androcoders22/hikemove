import { api } from "../axios";

export const getWithdrawalHistoryAPI = async () => {
  return await api.get("/withdrawal/me");
};

export const createWithdrawalAPI = async (payload: any) => {
  return await api.post("/withdrawal", payload);
};
