"use client";

import { useState } from "react";
import ExchangeDialog from "./ExchangeDialog";
import ExchangeCardSelect from "./ExchangeCardSelect";
import ExchangeOfferForm from "./ExchangeOfferForm";

/**
 * 보유 카드 선택 → 교환 제시 내용 입력 UI.
 * 조회/등록/에러 처리와 닫기 여부는 상위 화면이 담당한다.
 * 닫을 때 언마운트하면 다음 열기에서 선택/입력 상태가 초기화된다.
 */
export default function ExchangeModal({
  ownerships,
  filters,
  onFiltersChange,
  onClose,
  onSubmit,
  isLoading = false,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore,
  isSubmitting = false,
}) {
  const [selectedOwnership, setSelectedOwnership] = useState(null);
  const [description, setDescription] = useState("");

  const handleSelect = (ownership) => {
    setSelectedOwnership(ownership);
    setDescription("");
  };

  const handleBack = () => setSelectedOwnership(null);

  return (
    <ExchangeDialog
      title={
        selectedOwnership
          ? selectedOwnership.photoCard.name
          : "포토카드 교환하기"
      }
      eyebrow={selectedOwnership ? "포토카드 교환하기" : "마이갤러리"}
      mobileLayout={selectedOwnership ? "page" : "sheet"}
      containScroll={!selectedOwnership}
      onClose={onClose}
      onBack={handleBack}
    >
      {selectedOwnership ? (
        <ExchangeOfferForm
          ownership={selectedOwnership}
          description={description}
          onDescriptionChange={setDescription}
          onBack={handleBack}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      ) : (
        <ExchangeCardSelect
          ownerships={ownerships}
          filters={filters}
          onFiltersChange={onFiltersChange}
          onSelect={handleSelect}
          isLoading={isLoading}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={onLoadMore}
        />
      )}
    </ExchangeDialog>
  );
}
