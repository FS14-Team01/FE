import apiClient from "@/lib/axios";

/** saleId를 지정하면 해당 판매글의 본인 제안만, 생략하면 전체 보낸 제안을 조회한다. */
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
