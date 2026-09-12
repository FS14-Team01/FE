"use client";

import { useMutation } from "@tanstack/react-query";
import { updateExchangeOfferStatus } from "../api/sales-api.js";

function useUpdateExchangeOfferStatus() {
  return useMutation({
    mutationFn: ({ exchangeOfferId, status }) =>
      updateExchangeOfferStatus(exchangeOfferId, status),
  });
}

export default useUpdateExchangeOfferStatus;
