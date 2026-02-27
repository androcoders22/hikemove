import axios from "axios";
import { api, BASE_URL } from "../axios";

export const adminLogin = async (data: any) => {
  const response = await api.post("/admin/login", data);
  return response.data;
};

export const adminRefresh = async () => {
  const response = await axios.post(
    `${BASE_URL}/admin/refresh`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    },
  );
  return response.data;
};
