"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

const GRADE_CLASS_NAMES = {
  COMMON: "common",
  RARE: "rare",
  SUPER_RARE: "superRare",
  LEGENDARY: "legendary",
};

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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const modalRef = useRef(null);
  const loadMoreRef = useRef(null);
  const isSubmittingRef = useRef(false);
  const dragStartYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

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
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = ownershipsQuery;
  const createSaleMutation = useCreateSale();
  const ownerships = (ownershipsQuery.data?.pages ?? [])
    .flatMap((page) => page.items ?? [])
    .map(normalizeOwnership);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (step !== "select") return;

    const target = loadMoreRef.current;
    if (!target || !hasNextPage) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(target);
    return () => observer.disconnect();
  }, [step, fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    modalRef.current?.scrollTo({ top: 0 });
  }, [step]);

  const handleDragStart = (event) => {
    dragStartYRef.current = event.clientY;
    isDraggingRef.current = true;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleDragMove = (event) => {
    if (!isDraggingRef.current) return;
    setDragOffset(Math.max(0, event.clientY - dragStartYRef.current));
  };

  const handleDragEnd = (event) => {
    if (!isDraggingRef.current) return;

    const finalOffset = Math.max(0, event.clientY - dragStartYRef.current);
    isDraggingRef.current = false;
    setIsDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (finalOffset >= 120) {
      onClose();
      return;
    }

    setDragOffset(0);
  };

  const selectCard = (ownership) => {
    if (ownership.quantity < 1) return;
    setSelected(ownership);
    setQuantity(1);
    setPrice("");
    setDesiredGrade("");
    setDesiredCategory("");
    setDesiredDescription("");
    setIsMobileFilterOpen(false);
    setStep("form");
  };

  const submitSale = (event) => {
    event.preventDefault();
    if (isSubmittingRef.current) return;

    const numericPrice = Number(price);

    if (
      price === "" ||
      !Number.isInteger(numericPrice) ||
      numericPrice < 0 ||
      numericPrice > 1000
    ) {
      showToast({ status: "info", message: "가격은 0P 이상 1,000P 이하로 입력해 주세요." });
      return;
    }

    isSubmittingRef.current = true;
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
          showToast({ status: "success", action: "sale" });
          onClose();
          router.push(`/marketplace/${sale.id}`);
        },
        onError: () => {
          showToast({ status: "failure", action: "sale" });
        },
        onSettled: () => {
          isSubmittingRef.current = false;
        },
      },
    );
  };

  return (
    <div className={`${styles.overlay} ${step === "form" ? styles.formOverlay : ""}`} role="dialog" aria-modal="true" aria-label="나의 포토카드 판매하기">
      <div
        ref={modalRef}
        className={`${styles.modal} ${step === "form" ? styles.formModal : ""} ${isDragging ? styles.dragging : ""}`}
        style={{ transform: `translateY(${dragOffset}px)` }}
      >
        <button
          type="button"
          className={styles.dragHandle}
          aria-label="아래로 밀어서 모달 닫기"
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
        />
        {step === "form" && (
          <div className={styles.mobileFormHeader}>
            <button type="button" onClick={() => setStep("select")} aria-label="포토카드 선택으로 돌아가기">
              ‹
            </button>
            <strong>나의 포토카드 판매하기</strong>
          </div>
        )}
        <button type="button" className={styles.close} onClick={onClose} aria-label="닫기">×</button>
        <p className={styles.eyebrow}>{step === "select" ? "마이갤러리" : "나의 포토카드 판매하기"}</p>
        <h2 className={`${styles.title} ${step === "select" ? styles.selectionTitle : ""}`}>{step === "select" ? "나의 포토카드 판매하기" : selected.photoCard.name}</h2>

        {step === "select" ? (
          <>
            <div className={styles.filters}>
              <button
                type="button"
                className={`${styles.mobileFilterButton} ${grade || category ? styles.mobileFilterActive : ""}`}
                onClick={() => setIsMobileFilterOpen((isOpen) => !isOpen)}
                aria-label="필터"
                aria-expanded={isMobileFilterOpen}
              >
                <span aria-hidden="true" />
              </button>
              <SearchInput
                className={styles.searchInput}
                value={keywordInput}
                onChange={(value) => {
                  setKeywordInput(value);
                  if (value.trim() === "") setKeyword("");
                }}
                onSearch={setKeyword}
              />
              <div className={styles.desktopFilter}>
                <Dropdown className={styles.filterDropdown} options={CARD_GRADE_OPTIONS} value={grade} onChange={(value) => setGrade((current) => current === value ? "" : value)} placeholder="등급" label="등급 필터" />
              </div>
              <div className={styles.desktopFilter}>
                <Dropdown className={styles.filterDropdown} options={CARD_CATEGORY_OPTIONS} value={category} onChange={(value) => setCategory((current) => current === value ? "" : value)} placeholder="장르" label="장르 필터" />
              </div>
            </div>
            {isMobileFilterOpen && (
              <div className={styles.mobileFilterPanel}>
                <Dropdown variant="sort" options={CARD_GRADE_OPTIONS} value={grade} onChange={(value) => setGrade((current) => current === value ? "" : value)} placeholder="등급" label="등급 필터" />
                <Dropdown variant="sort" options={CARD_CATEGORY_OPTIONS} value={category} onChange={(value) => setCategory((current) => current === value ? "" : value)} placeholder="장르" label="장르 필터" />
                <button type="button" onClick={() => { setGrade(""); setCategory(""); }}>
                  초기화
                </button>
              </div>
            )}
            {ownershipsQuery.isLoading && <p className={styles.state}>보유 포토카드를 불러오는 중입니다.</p>}
            {ownershipsQuery.isError && <p className={styles.state}>{ownershipsQuery.error?.message ?? "보유 포토카드를 불러오지 못했습니다."}</p>}
            {!ownershipsQuery.isLoading && !ownershipsQuery.isError && ownerships.length === 0 && (
              <p className={styles.state}>판매할 수 있는 포토카드가 없습니다.</p>
            )}
            <div className={styles.cardGrid}>
              {ownerships.map((ownership) => (
                <button key={ownership.ownershipId ?? ownership.photoCard.id} type="button" className={styles.card} onClick={() => selectCard(ownership)}>
                  <div className={styles.cardImage}>
                    <img src={ownership.photoCard.imageUrl} alt={ownership.photoCard.name} />
                  </div>
                  <strong className={styles.cardName}>{ownership.photoCard.name}</strong>
                  <div className={styles.cardMeta}>
                    <div className={styles.gradeCategory}>
                      <span className={styles[GRADE_CLASS_NAMES[ownership.photoCard.grade]]}>{ownership.photoCard.grade?.replace("_", " ")}</span>
                      <i aria-hidden="true" />
                      <span className={styles.cardCategory}>{getCardCategoryLabel(ownership.photoCard.category)}</span>
                    </div>
                    {(ownership.photoCard.creatorNickname || ownership.photoCard.creator?.nickname) && (
                      <span className={styles.cardNickname}>{ownership.photoCard.creatorNickname ?? ownership.photoCard.creator.nickname}</span>
                    )}
                  </div>
                  <div className={styles.cardSaleInfo}>
                    <div><span>수량</span><b>{ownership.quantity}</b></div>
                  </div>
                  <img className={styles.cardLogo} src="/assets/logo.png" alt="최애의 포토" />
                </button>
              ))}
            </div>
            <div ref={loadMoreRef} className={styles.loadMore} aria-hidden="true" />
            {ownershipsQuery.isFetchingNextPage && <p className={styles.fetching}>불러오는 중...</p>}
          </>
        ) : (
          <form className={styles.saleForm} onSubmit={submitSale}>
            <div className={styles.summary}>
              <img src={selected.photoCard.imageUrl} alt={selected.photoCard.name} />
              <div className={styles.saleFields}>
                <div className={styles.meta}><b className={styles[GRADE_CLASS_NAMES[selected.photoCard.grade]]}>{selected.photoCard.grade?.replace("_", " ")}</b><span>{getCardCategoryLabel(selected.photoCard.category)}</span></div>
                <label><span>총 판매 수량</span><div className={styles.stepper}><button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button><b>{quantity}</b><button type="button" onClick={() => setQuantity((value) => Math.min(selected.quantity, value + 1))}>+</button></div><small>/ {selected.quantity}<em>최대 {selected.quantity}장</em></small></label>
                <label><span>장당 가격</span><div className={styles.price}><input value={price} onChange={(event) => setPrice(event.target.value.replace(/\D/g, ""))} inputMode="numeric" placeholder="숫자만 입력" /><b>P</b></div></label>
              </div>
            </div>
            <section className={styles.preference}>
              <h3>교환 희망 정보</h3>
              <div className={styles.selects}>
                <label><span>등급</span><Dropdown className={styles.preferenceDropdown} variant="sort" options={CARD_GRADE_OPTIONS} value={desiredGrade} onChange={(value) => setDesiredGrade((current) => current === value ? "" : value)} placeholder="등급을 선택해 주세요" label="교환 희망 등급" /></label>
                <label><span>장르</span><Dropdown className={styles.preferenceDropdown} variant="sort" options={CARD_CATEGORY_OPTIONS} value={desiredCategory} onChange={(value) => setDesiredCategory((current) => current === value ? "" : value)} placeholder="장르를 선택해 주세요" label="교환 희망 장르" /></label>
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
