import axios from "axios";
// import {} from "./types";

// export const BASE_URL = "http://0.0.0.0:8000";

export const BASE_URL = "http://192.168.1.99:8001";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 100000, // 1.5 minutes
});

// Auto error handling with interceptors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API Error:", error.response?.data || error.message);
    throw error;
  }
);

export const getCredentialValue = async (key: string, type: 'username' | 'password' | 'url') => {
  const endpoint = type === 'username' ? 'usernames' : type === 'password' ? 'passwords' : 'urls';
  const response = await api.get(`/${endpoint}/${key}`);
  console.log("get credentials",response);
  return response.data;
};

export const updateCredentialValue = async (key: string, value: string, type: 'username' | 'password' | 'url') => {
  const endpoint = type === 'username' ? 'usernames' : type === 'password' ? 'passwords' : 'urls';
  const response = await api.put(`/${endpoint}`, {
    key,
    value
  });
  return response.data;
};

export const fetchWorkflowRuns = async (type: string) => {
  const response = await api.get(`/workflow/runs/${type}`);
  return response.data;
};
