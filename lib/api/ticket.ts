import { api } from "../axios";

export enum TicketStatus {
  OPEN = "open",
  IN_PROGRESS = "inProgress",
  RESOLVED = "resolved",
}

export enum TicketType {
  TOPUP = 'topup',
  TRANSFER = 'transfer',
  HASH_VERIFICATION = 'hashVerification',
  ACTIVATION = 'activation',
  COIN = 'coin',
  PAYMENT = 'payment',
  WITHDRAWAL = 'withdrawal',
  OTHERS = 'others',
}

export const getTicketsAPI = async () => {
  return await api.get("/ticket");
};

export const createTicketAPI = async (payload: any) => {
  return await api.post("/ticket", payload);
};

export const updateTicketAPI = async (id: string, payload: any) => {
  return await api.patch(`/ticket/${id}`, payload);
};
