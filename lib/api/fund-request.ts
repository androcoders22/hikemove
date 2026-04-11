import { api } from "../axios";

export const getFundRequestsMeAPI = async (page: number = 1, limit: number = 10) => {
  return await api.get(`/fund-request/me?page=${page}&limit=${limit}`);
};

export const createFundRequestAPI = async (payload: any) => {
  return await api.post("/fund-request", payload);
};

export const getAllFundRequestsAPI = async (page: number = 1, limit: number = 10) => {
  return await api.get(`/fund-request?page=${page}&limit=${limit}`);
};

export const approveFundRequestAPI = async (id: string) => {
  return await api.patch(`/fund-request/${id}/approve`);
};

export const rejectFundRequestAPI = async (id: string) => {
  try {
    return await api.patch(`/fund-request/${id}/reject`);
  } catch (error: any) {
    if (error?.response?.status !== 404) {
      throw error;
    }

    try {
      return await api.patch(`/fund-request/${id}`, { status: "rejected" });
    } catch (fallbackError: any) {
      if (fallbackError?.response?.status !== 404) {
        throw fallbackError;
      }

      return await api.patch(`/fund-request/status/${id}`, {
        status: "rejected",
      });
    }
  }
};

export const addFundByAdminAPI = async (payload: {
  member: string;
  entryType: string;
  depositBalance: number;
  remarks: string;
}) => {
  return await api.post("/fund-request/add-fund", payload);
};
