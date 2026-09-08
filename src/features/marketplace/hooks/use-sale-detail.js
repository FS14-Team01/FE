'use client';

import { useQuery } from '@tanstack/react-query';
import { marketKeys } from '@/lib/query-keys';
import { getSaleDetail } from '../api/sales-api';

export default function useSaleDetail(saleId) {
  return useQuery({
    queryKey: marketKeys.detail(saleId),
    queryFn: () => getSaleDetail(saleId),
    enabled: Boolean(saleId),
  });
}
