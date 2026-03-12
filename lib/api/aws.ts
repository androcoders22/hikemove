import { api } from "../axios";

export const uploadImageAPI = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/aws", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
