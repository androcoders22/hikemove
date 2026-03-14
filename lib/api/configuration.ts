import { api } from "../axios";

const CONFIG_ENDPOINT = "/app-setting";

export interface CoinPaymentSettingsPayload {
  coinSetting: {
    coinName: string;
    coinSymbol: string;
    coinPrice: string;
  };
  paymentSetting: {
    paymentQr: string;
    paymentAddress: string | number;
  };
}

export const getCoinPaymentSettingsAPI = async () => {
  return await api.get(CONFIG_ENDPOINT);
};

export const updateCoinPaymentSettingsAPI = async (
  payload: CoinPaymentSettingsPayload,
) => {
  return await api.patch(CONFIG_ENDPOINT, payload);
};
