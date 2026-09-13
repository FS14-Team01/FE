import apiClient from "@/lib/axios";

// 유저 포인트 조회
export async function getPoints() {
  const response = await apiClient.get("/points/me");
  return response.data;
}

// 랜덤 포인트 뽑기
export async function drawRandomPoint() {
  const response = await apiClient.post("/points/random-draws");
  return response.data;
}
