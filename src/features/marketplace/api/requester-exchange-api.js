import apiClient from "@/lib/axios";

/** 테스트 확장 saleId로 현재 판매글의 본인 제안만 조회한다. */
export async function getMyExchangeOffers({ saleId, cursor, signal }) {
  const response = await apiClient.get("/users/me/exchange-offers", {
    params: { saleId, limit: 12, cursor },
    signal,
  });
  return response.data?.data ?? response.data;
}

export async function cancelMyExchangeOffer(exchangeOfferId) {
  const response = await apiClient.patch(
    `/exchange-offers/${exchangeOfferId}`,
    {
      status: "CANCELLED",
    },
  );
  return response.data?.data ?? response.data;
}
