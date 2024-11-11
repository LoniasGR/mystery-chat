import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default client;
