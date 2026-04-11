import { api } from "../axios";

export enum LedgerType {
  PACKAGE_PURCHASE = 'packagePurchase',
  WITHDRAWAL = 'withdrawal',
  TOPUP = 'topUp',
  FUND_REQUEST = 'fundRequest',
  ADMIN_ADJUSTMENT = 'adminAdjustment',
  SPONSOR_BONUS = 'sponsorBonus',
  TEAM_LEVEL_BONUS = 'teamLevelBonus',
  WEEKLY_BONUS = 'weeklyBonus',
  ROI_LEVEL_BONUS = 'roiLevelBonus',
}

export const getLedgerAPI = async (type: string, page: number = 1, limit: number = 10) => {
  return await api.get(`/ledger/me?type=${type}&page=${page}&limit=${limit}`);
};

export const getSponsorBonusAPI = async (page: number = 1, limit: number = 10) => {
  return await api.get(`/ledger/me?type=${LedgerType.SPONSOR_BONUS}&page=${page}&limit=${limit}`);
};

export const getTeamLevelBonusAPI = async (page: number = 1, limit: number = 10) => {
  return await api.get(`/ledger/me?type=${LedgerType.TEAM_LEVEL_BONUS}&page=${page}&limit=${limit}`);
};

export const getWeeklyProfitBonusAPI = async (page: number = 1, limit: number = 10) => {
  return await api.get(`/ledger/me?type=${LedgerType.WEEKLY_BONUS}&page=${page}&limit=${limit}`);
};

export const getLevelProfitBonusAPI = async (page: number = 1, limit: number = 10) => {
  return await api.get(`/ledger/me?type=${LedgerType.ROI_LEVEL_BONUS}&page=${page}&limit=${limit}`);
};

export const getPaidIncomeAPI = async (page: number = 1, limit: number = 10) => {
  return await api.get(`/ledger/paid-income?page=${page}&limit=${limit}`);
};

export const getLedgerMeAPI = async (page: number = 1, limit: number = 10) => {
  return await api.get(`/ledger/me?page=${page}&limit=${limit}`);
};

export const getLedgerByMemberIdAPI = async (memberId: string) => {
  return await api.get(`/ledger/member/${encodeURIComponent(memberId)}`);
};

export const getAllLedgerEntriesAPI = async () => {
  const types = Object.values(LedgerType);

  const responses = await Promise.all(
    types.map((type) => api.get(`/ledger/me?type=${type}`)),
  );

  const mergedData = responses.flatMap((response) =>
    response.data?.status && Array.isArray(response.data.data)
      ? response.data.data
      : [],
  );

  const uniqueData = Array.from(
    new Map(mergedData.map((entry: any) => [entry._id, entry])).values(),
  );

  return {
    data: {
      status: true,
      data: uniqueData,
    },
  };
};
