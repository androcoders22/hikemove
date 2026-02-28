import { api } from "../axios";

export const getTicketsAPI = async () => {
  return await api.get("/ticket");
};

export const createTicketAPI = async (payload: any) => {
  return await api.post("/ticket", payload);
};
