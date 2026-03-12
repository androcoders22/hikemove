import { api } from "../axios";

export enum PackageType {
  HUNDRED = '100',
  FIVE_HUNDRED = '500',
  THOUSAND = '1000',
  FIVE_THOUSAND = '5000',
  TEN_THOUSAND = '10000',
  TWENTY_FIVE_THOUSAND = '25000',
  FIFTY_THOUSAND = '50000',
}

export const checkMemberIdAPI = async (memberId: string) => {
  return await api.get(`/member/check-member-id/${memberId}`);
};

export const createMemberTopupAPI = async (data: {
  fromMember: string;
  toMember: string;
  amount: number;
}) => {
  return await api.post("/member-topup", data);
};

export const getMemberTopupsAPI = async () => {
  return await api.get("/member-topup/me");
};
