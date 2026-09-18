import apiClient from "@/lib/axios";

export async function login(loginData) {
  const response = await apiClient.post("/auth/login", loginData);

  return response.data;
}

export async function signUp(signUpData) {
  const response = await apiClient.post("/auth/signup", signUpData);

  return response.data;
}

export async function getMyInfo() {
  const response = await apiClient.get("/users/me");

  return response.data;
}

export async function logout() {
  const response = await apiClient.post("/auth/logout");

  return response.data;
}
