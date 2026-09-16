import apiClient from "@/lib/axios";

export async function createExchangeOffer(
  saleId,
  { offeredCardId, offeredDescription },
) {
  const response = await apiClient.post(`/sales/${saleId}/exchange-offers`, {
    offeredCardId,
    offeredDescription,
  });
  return response.data?.data ?? response.data;
}

export async function getSaleDetail(saleId) {
  const response = await apiClient.get(`/sales/${saleId}`);

  return response.data?.data ?? response.data;
}

export async function getExchangeOffers(saleId, { cursor, limit }) {
  const res = await apiClient.get(`/sales/${saleId}/exchange-offers`, {
    params: {
      cursor,
      limit,
    },
  });

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
export async function getMyOwnerships(filters = {}) {
  const response = await apiClient.get("/users/me/ownerships", {
    params: filters,
  });

  return response.data?.data ?? response.data;
}

export async function createSale(saleData) {
  const response = await apiClient.post("/sales", saleData);

  return response.data?.data ?? response.data;
}

export async function getMySales(filters = {}) {
  const response = await apiClient.get("/users/me/sales", {
    params: filters,
  });

  return response.data?.data ?? response.data;
}

export async function getMySalesSummary() {
  const response = await apiClient.get("/users/me/sales/summary");

  return response.data?.data ?? response.data;
}
