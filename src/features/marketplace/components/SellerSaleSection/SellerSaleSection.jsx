"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/common/Modal/Modal";
import { useToast } from "@/components/common/Toast/ToastProvider";
import { useStopSale, useUpdateSale } from "../../hooks/use-sale-management";
import SaleEditModal from "../SaleEditModal/SaleEditModal";
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
        showToast({ status: "info", message: "판매 정보가 수정되었습니다." });
      },
      onError: (error) => {
        showToast({
          status: "info",
          message: error?.message ?? "판매 정보를 수정하지 못했습니다.",
        });
      },
    });
  };

  const handleStopSale = () => {
    if (stopSaleMutation.isPending) return;

    stopSaleMutation.mutate(undefined, {
      onSuccess: () => {
        setIsStopModalOpen(false);
        showToast({ status: "info", message: "판매가 종료되었습니다." });
        router.replace("/marketplace");
      },
      onError: (error) => {
        showToast({
          status: "info",
          message: error?.message ?? "판매를 내리지 못했습니다.",
        });
      },
    });
  };

  return (
    <>
      <section
        className={styles.section}
        aria-labelledby="seller-sale-section-title"
        data-sale-id={sale.id}
      >
        <div className={styles.heading}>
          <h2 id="seller-sale-section-title" className={styles.title}>
            교환 희망 정보
          </h2>
        </div>

        <div className={styles.preference}>
          {/* 교환 희망 등급, 장르 및 설명 */}
        </div>

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
