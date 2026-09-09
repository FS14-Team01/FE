import apiClient from "@/lib/axios";

export async function getSaleDetail(saleId) {
  const response = await apiClient.get(`/sales/${saleId}`);

  return response.data?.data ?? response.data;
}

export async function getExchangeOffers(saleId) {
  const res = await apiClient.get(`/sales/${saleId}/exchange-offers`);

  return res.data?.data ?? res.data;
}
