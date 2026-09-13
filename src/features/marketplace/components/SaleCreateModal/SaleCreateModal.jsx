"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Dropdown from "@/components/common/Dropdown/Dropdown";
import SearchInput from "@/components/common/SearchInput/SearchInput";
import { useToast } from "@/components/common/Toast/ToastProvider";
import {
  CARD_CATEGORY_OPTIONS,
  CARD_GRADE_OPTIONS,
  getCardCategoryLabel,
} from "@/constants/marketplace-options";
import { useCreateSale, useMyOwnerships } from "../../hooks/use-sale-create";
import styles from "./SaleCreateModal.module.css";

function normalizeOwnership(ownership) {
  const photoCard = ownership.photoCard ?? ownership;

  return {
    ownershipId: ownership.id,
    quantity: ownership.quantity ?? 0,
    photoCard,
  };
}

export default function SaleCreateModal({ onClose }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [step, setStep] = useState("select");
  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [grade, setGrade] = useState("");
  const [category, setCategory] = useState("");
  const [selected, setSelected] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");
  const [desiredGrade, setDesiredGrade] = useState("");
  const [desiredCategory, setDesiredCategory] = useState("");
  const [desiredDescription, setDesiredDescription] = useState("");

  const filters = useMemo(
    () => ({
      ...(keyword ? { keyword } : {}),
      ...(grade ? { grade } : {}),
      ...(category ? { category } : {}),
      limit: 12,
    }),
    [keyword, grade, category],
  );
  const ownershipsQuery = useMyOwnerships(filters);
  const createSaleMutation = useCreateSale();
  const ownerships = (ownershipsQuery.data?.pages ?? [])
    .flatMap((page) => page.items ?? [])
    .map(normalizeOwnership);

  const selectCard = (ownership) => {
    if (ownership.quantity < 1) return;
    setSelected(ownership);
    setQuantity(1);
    setStep("form");
  };

  const submitSale = (event) => {
    event.preventDefault();
    const numericPrice = Number(price);

    if (!Number.isInteger(numericPrice) || numericPrice < 0 || numericPrice > 1000) {
      showToast({ status: "info", message: "가격은 0P 이상 1,000P 이하로 입력해 주세요." });
      return;
    }

    createSaleMutation.mutate(
      {
        photoCardId: String(selected.photoCard.id),
        quantity,
        price: numericPrice,
        desiredGrade: desiredGrade || null,
        desiredCategory: desiredCategory || null,
        desiredDescription: desiredDescription.trim() || null,
      },
      {
        onSuccess: (sale) => {
          showToast({ status: "info", message: "포토카드가 판매 등록되었습니다." });
          onClose();
          router.push(`/marketplace/${sale.id}`);
        },
        onError: (error) => {
          showToast({ status: "info", message: error?.message ?? "판매를 등록하지 못했습니다." });
        },
      },
    );
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="나의 포토카드 판매하기">
      <div className={styles.modal}>
        <button type="button" className={styles.close} onClick={onClose} aria-label="닫기">×</button>
        <p className={styles.eyebrow}>{step === "select" ? "마이갤러리" : "나의 포토카드 판매하기"}</p>
        <h2 className={styles.title}>{step === "select" ? "나의 포토카드 판매하기" : selected.photoCard.name}</h2>

        {step === "select" ? (
          <>
            <div className={styles.filters}>
              <SearchInput value={keywordInput} onChange={setKeywordInput} onSearch={setKeyword} />
              <Dropdown options={CARD_GRADE_OPTIONS} value={grade} onChange={setGrade} placeholder="등급" label="등급 필터" />
              <Dropdown options={CARD_CATEGORY_OPTIONS} value={category} onChange={setCategory} placeholder="장르" label="장르 필터" />
            </div>
            {ownershipsQuery.isLoading && <p className={styles.state}>보유 포토카드를 불러오는 중입니다.</p>}
            {ownershipsQuery.isError && <p className={styles.state}>{ownershipsQuery.error?.message ?? "보유 포토카드를 불러오지 못했습니다."}</p>}
            {!ownershipsQuery.isLoading && !ownershipsQuery.isError && ownerships.length === 0 && (
              <p className={styles.state}>판매할 수 있는 포토카드가 없습니다.</p>
            )}
            <div className={styles.cardGrid}>
              {ownerships.map((ownership) => (
                <button key={ownership.ownershipId ?? ownership.photoCard.id} type="button" className={styles.card} onClick={() => selectCard(ownership)}>
                  <img src={ownership.photoCard.imageUrl} alt={ownership.photoCard.name} />
                  <strong>{ownership.photoCard.name}</strong>
                  <div className={styles.cardMeta}>
                    <span>{ownership.photoCard.grade?.replace("_", " ")}</span>
                    <span>{getCardCategoryLabel(ownership.photoCard.category)}</span>
                  </div>
                  <div className={styles.quantity}><span>수량</span><b>{ownership.quantity}</b></div>
                </button>
              ))}
            </div>
            {ownershipsQuery.hasNextPage && (
              <button
                type="button"
                className={styles.loadMore}
                disabled={ownershipsQuery.isFetchingNextPage}
                onClick={() => ownershipsQuery.fetchNextPage()}
              >
                {ownershipsQuery.isFetchingNextPage ? "불러오는 중..." : "더 보기"}
              </button>
            )}
          </>
        ) : (
          <form onSubmit={submitSale}>
            <div className={styles.summary}>
              <img src={selected.photoCard.imageUrl} alt={selected.photoCard.name} />
              <div className={styles.saleFields}>
                <div className={styles.meta}><b>{selected.photoCard.grade?.replace("_", " ")}</b><span>{getCardCategoryLabel(selected.photoCard.category)}</span></div>
                <label><span>총 판매 수량</span><div className={styles.stepper}><button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button><b>{quantity}</b><button type="button" onClick={() => setQuantity((value) => Math.min(selected.quantity, value + 1))}>+</button></div><small>/ {selected.quantity}</small></label>
                <label><span>장당 가격</span><div className={styles.price}><input value={price} onChange={(event) => setPrice(event.target.value.replace(/\D/g, ""))} inputMode="numeric" placeholder="숫자만 입력" /><b>P</b></div></label>
              </div>
            </div>
            <section className={styles.preference}>
              <h3>교환 희망 정보</h3>
              <div className={styles.selects}>
                <label><span>등급</span><Dropdown options={CARD_GRADE_OPTIONS} value={desiredGrade} onChange={setDesiredGrade} placeholder="등급을 선택해 주세요" label="교환 희망 등급" /></label>
                <label><span>장르</span><Dropdown options={CARD_CATEGORY_OPTIONS} value={desiredCategory} onChange={setDesiredCategory} placeholder="장르를 선택해 주세요" label="교환 희망 장르" /></label>
              </div>
              <label className={styles.description}><span>교환 희망 설명</span><textarea value={desiredDescription} onChange={(event) => setDesiredDescription(event.target.value)} placeholder="교환 희망 내용을 입력해 주세요." /></label>
            </section>
            <div className={styles.actions}>
              <button type="button" onClick={() => setStep("select")}>취소하기</button>
              <button type="submit" disabled={createSaleMutation.isPending}>{createSaleMutation.isPending ? "등록 중..." : "판매하기"}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
