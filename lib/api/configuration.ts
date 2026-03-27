import { api } from "../axios";

const CONFIG_ENDPOINT = "/app-setting/";

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
  try {
    return await api.patch(CONFIG_ENDPOINT, payload);
  } catch (error: any) {
    const statusCode = error?.response?.status;
    const message = error?.response?.data?.message;
    const notFound = statusCode === 404 && message === "App setting not found";

    if (notFound) {
      return await api.post(CONFIG_ENDPOINT, payload);
    }

    throw error;
  }
};
