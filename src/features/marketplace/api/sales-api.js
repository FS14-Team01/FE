import apiClient from "@/lib/axios";

export async function getSaleDetail(saleId) {
  const response = await apiClient.get(`/sales/${saleId}`);

  return response.data?.data ?? response.data;
}
