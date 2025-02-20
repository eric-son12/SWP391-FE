import axios from "../utils/axiosConfig";

export const loginToken = async (username: string, password: string) => {
  const resp = await axios.post("/auth/loginToken", { username, password });
  return resp.data;
};