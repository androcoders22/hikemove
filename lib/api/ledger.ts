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
