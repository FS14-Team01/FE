import apiClient from "@/lib/axios";

export async function getOwnerships({ filters, cursor, signal }) {
  const params = { limit: 12, cursor };
  for (const key of ["keyword", "grade", "category"]) {
    if (filters[key]) params[key] = filters[key];
  }
  const response = await apiClient.get("/users/me/ownerships", {
    params,
    signal,
  });
  return response.data?.data ?? response.data;
}
