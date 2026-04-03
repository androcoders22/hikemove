import axios from "axios";
import { api, BASE_URL } from "../axios";

export const memberLogin = async (data: any) => {
  const response = await api.post("/member/login", data);
  return response.data;
};

export const memberSignup = async (data: any) => {
  const response = await api.post("/member", data);
  return response.data;
};

export const requestMemberPasswordOtp = async (data: {
  memberId: string;
  email?: string;
}) => {
  const payload = data.email ? { email: data.email } : undefined;
  const config = data.email
    ? {
        headers: {
          "Content-Type": "application/json",
        },
      }
    : undefined;

  const response = await api.post(
    `/member/forgot-password/${encodeURIComponent(data.memberId)}`,
    payload,
    config,
  );
  return response.data;
};

export const resetMemberPassword = async (data: {
  memberId: string;
  otp: string;
  newPassword: string;
}) => {
  const response = await api.post("/member/reset-password", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const getMember = async (memberId: string) => {
  const response = await api.get(`/member/member/${memberId}`);
  return response.data;
};

export const memberRefresh = async () => {
  const response = await axios.post(
    `${BASE_URL}/member/refresh`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    },
  );
  return response.data;
};
export const getMemberTreeAPI = async (memberId?: string) => {
  const url = memberId ? `/member/tree/${memberId}` : "/member/tree";
  return await api.get(url);
};

export const getMemberMyTeamAPI = async () => {
  return await api.get("/member/my-team");
};

export const getDirectMembersAPI = async () => {
  return await api.get("/member/direct-members/");
};

export const checkMemberIdAPI = async (memberId: string) => {
  return await api.get(`/member/check-member-id/${memberId}/`);
};

export const getMemberPackagesAPI = async () => {
  return await api.get("/member-topup/only-me/");
};

