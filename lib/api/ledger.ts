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

export const getLedgerAPI = async (type: string) => {
  return await api.get(`/ledger/me?type=${type}`);
};

export const getSponsorBonusAPI = async () => {
  return await api.get(`/ledger/me?type=${LedgerType.SPONSOR_BONUS}`);
};

export const getTeamLevelBonusAPI = async () => {
  return await api.get(`/ledger/me?type=${LedgerType.TEAM_LEVEL_BONUS}`);
};

export const getWeeklyProfitBonusAPI = async () => {
  return await api.get(`/ledger/me?type=${LedgerType.WEEKLY_BONUS}`);
};

export const getLevelProfitBonusAPI = async () => {
  return await api.get(`/ledger/me?type=${LedgerType.ROI_LEVEL_BONUS}`);
};

export const getLedgerMeAPI = async () => {
  return await api.get("/ledger/me");
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
