import apiClient from "@/lib/axios";

export async function getSaleDetail(saleId) {
  const response = await apiClient.get(`/sales/${saleId}`);

  return response.data?.data ?? response.data;
}

export async function getExchangeOffers(saleId) {
  const res = await apiClient.get(`/sales/${saleId}/exchange-offers`);

  return res.data?.data ?? res.data;
}

export async function updateExchangeOfferStatus(exchangeOfferId, status) {
  const res = await apiClient.patch(`/exchange-offers/${exchangeOfferId}`, {
    status,
  });

  return res.data?.data ?? res.data;
}

export async function updateSale(saleId, updateData) {
  const response = await apiClient.patch(`/sales/${saleId}`, updateData);

  return response.data?.data ?? response.data;
}

export async function stopSale(saleId) {
  const response = await apiClient.post(`/sales/${saleId}/stop`);

  return response.data?.data ?? response.data;
}
