import { api } from "../axios";

export const getWalletAPI = async () => {
  return await api.get("/wallet/me");
};
