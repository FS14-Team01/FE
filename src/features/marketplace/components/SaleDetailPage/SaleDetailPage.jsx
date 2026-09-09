"use client";

import useSaleDetail from "../../hooks/use-sale-detail";
import ExchangePreference from "../ExchangePreference/ExchangePreference";
import ExchangeOfferSection from "../ExchangeOfferSection/ExchangeOfferSection";
import PurchaseSection from "../PurchaseSection/PurchaseSection";
import SaleCardOverview from "../SaleCardOverview/SaleCardOverview";
import SellerSaleSection from "../SellerSaleSection/SellerSaleSection";
import styles from "./SaleDetailPage.module.css";

export default function SaleDetailPage({ saleId }) {
  const { data: sale, isPending, isError, error } = useSaleDetail(saleId);

  if (isPending) {
    return <main className={styles.state}>판매 정보를 불러오는 중입니다.</main>;
  }

  if (isError) {
    return (
      <main className={styles.state} role="alert">
        {error?.message ?? "판매 정보를 불러오지 못했습니다."}
      </main>
    );
  }

  //인증 유저 기능과 연결 필요
  //테스트 단계에서는 판매자 입장: const isOwner = true로 설정 / 구매자 입장 : const isOwner = false로 설정
  const isOwner = sale.isOwner === true;

  return (
    <main className={styles.main}>
      <SaleCardOverview sale={sale}>
        {isOwner ? (
          <SellerSaleSection sale={sale} />
        ) : (
          <div className={styles.actions}>
            <PurchaseSection sale={sale} />
          </div>
        )}
      </SaleCardOverview>

      {!isOwner && <ExchangePreference variant="full" />}

      {isOwner && <ExchangeOfferSection saleId={saleId} />}
    </main>
  );
}
