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

export const getDirectMembersAPI = async () => {
  return await api.get("/member/direct-members/");
};

export const checkMemberIdAPI = async (memberId: string) => {
  return await api.get(`/member/check-member-id/${memberId}/`);
};
