import { api } from "../axios";

export const checkMemberIdAPI = async (memberId: string) => {
  return await api.get(`/member/check-member-id/${memberId}`);
};

export const createMemberTopupAPI = async (data: {
  toMember: string;
  amount: number;
}) => {
  return await api.post("/member-topup", data);
};

export const getMemberTopupsAPI = async () => {
  return await api.get("/member-topup/me");
};
