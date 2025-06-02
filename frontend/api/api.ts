import axios from "axios";

const baseURL = (import.meta as any).env.VITE_API_BASE_URL;

const instance = axios.create({
  baseURL,
});

export default instance;
