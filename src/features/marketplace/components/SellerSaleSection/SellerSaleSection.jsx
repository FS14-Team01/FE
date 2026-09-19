"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/common/Modal/Modal";
import { useToast } from "@/components/common/Toast/ToastProvider";
import { useStopSale, useUpdateSale } from "../../hooks/use-sale-management";
import SaleEditModal from "../SaleEditModal/SaleEditModal";
import ExchangePreference from "../ExchangePreference/ExchangePreference";
import styles from "./SellerSaleSection.module.css";

export default function SellerSaleSection({ sale }) {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const { showToast } = useToast();
  const updateSaleMutation = useUpdateSale(sale.id);
  const stopSaleMutation = useStopSale(sale.id);

  const handleUpdateSale = (updateData) => {
    updateSaleMutation.mutate(updateData, {
      onSuccess: () => {
        setIsEditModalOpen(false);
        showToast({
          status: "success",
          action: "saleEdit",
        });
      },
      onError: () => {
        showToast({
          status: "failure",
          action: "saleEdit",
        });
      },
    });
  };

  const handleStopSale = () => {
    if (stopSaleMutation.isPending) return;

    stopSaleMutation.mutate(undefined, {
      onSuccess: () => {
        setIsStopModalOpen(false);
        showToast({
          status: "success",
          action: "saleCancel",
        });
        router.replace("/marketplace");
      },
      onError: () => {
        showToast({
          status: "failure",
          action: "saleCancel",
        });
      },
    });
  };

  return (
    <>
      <section
        className={styles.section}
        aria-label="판매 관리"
        data-sale-id={sale.id}
      >
        <ExchangePreference sale={sale} variant="seller" />

        <div className={styles.actions}>
          <button
            className={styles.primary}
            type="button"
            disabled={sale.status !== "ON_SALE"}
            onClick={() => setIsEditModalOpen(true)}
          >
            수정하기
          </button>
          <button
            className={styles.secondary}
            type="button"
            disabled={sale.status !== "ON_SALE"}
            onClick={() => setIsStopModalOpen(true)}
          >
            판매 내리기
          </button>
        </div>
      </section>

      {isEditModalOpen && (
        <SaleEditModal
          sale={sale}
          isSubmitting={updateSaleMutation.isPending}
          onSubmit={handleUpdateSale}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {isStopModalOpen && (
        <div className={styles.stopModal}>
          <Modal
            title="포토카드 판매 내리기"
            message={
              <>
                정말로 판매를 중단하시겠습니까?
                <br />
                판매 중단 시 진행 중인 교환 제안은 모두 거절됩니다.
              </>
            }
            confirmText={
              stopSaleMutation.isPending ? "처리 중..." : "판매 내리기"
            }
            onConfirm={handleStopSale}
            onClose={() => setIsStopModalOpen(false)}
          />
        </div>
      )}
    </>
  );
}
