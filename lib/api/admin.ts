import axios from "axios";
import { api, BASE_URL } from "../axios";

export const adminLogin = async (data: any) => {
  const response = await api.post("/admin/login", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const verifyAdminOtp = async (data: { email: string; otp: string }) => {
  const response = await api.post("/admin/verify-otp", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const requestAdminPasswordOtp = async (data: { email: string }) => {
  const response = await api.post("/admin/forgot-password", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const resetAdminPassword = async (data: {
  email: string;
  otp: string;
  newPassword: string;
}) => {
  const response = await api.post("/admin/reset-password", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const adminRefresh = async () => {
  const response = await axios.post(
    `${BASE_URL}/admin/refresh`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    },
  );
  return response.data;
};

export const getAllMembersAPI = async () => {
  return await api.get("/member");
};

export const getActiveMembersAPI = async () => {
  return await api.get("/member");
};
