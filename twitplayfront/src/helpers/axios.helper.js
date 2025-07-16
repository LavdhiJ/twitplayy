import axios from "axios";

const baseURL = "/api/v1";

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
