export const CARD_CATEGORY_LABELS = {
  POKEMON: "포켓몬",
  SUPER_MARIO: "슈퍼마리오",
  HELLO_KITTY: "산리오",
  DIGIMON: "디지몬",
};

export const CARD_CATEGORY_OPTIONS = Object.entries(CARD_CATEGORY_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export const CARD_GRADE_LABELS = {
  COMMON: "COMMON",
  RARE: "RARE",
  SUPER_RARE: "SUPER RARE",
  LEGENDARY: "LEGENDARY",
};

export const CARD_GRADE_OPTIONS = Object.entries(CARD_GRADE_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export const SALE_STATUS_LABELS = {
  ON_SALE: "판매중",
  SOLD_OUT: "판매 완료",
  CANCELLED: "판매 취소",
};

export const SALE_STATUS_OPTIONS = [
  { value: "ON_SALE", label: SALE_STATUS_LABELS.ON_SALE },
  { value: "SOLD_OUT", label: SALE_STATUS_LABELS.SOLD_OUT },
];

export const EXCHANGE_STATUS_LABELS = {
  PENDING: "대기 중",
  ACCEPTED: "승인 완료",
  REJECTED: "거절 완료",
  CANCELLED: "취소됨",
};

export const EXCHANGE_STATUS_OPTIONS = Object.entries(
  EXCHANGE_STATUS_LABELS,
).map(([value, label]) => ({ value, label }));

/**
 * 카드 카테고리 enum을 화면 표시명으로 변환합니다.
 *
 * @param {unknown} category 카드 카테고리 enum
 * @returns {string} 카테고리 표시명
 */
export function getCardCategoryLabel(category) {
  if (typeof category !== "string") return "";

  return CARD_CATEGORY_LABELS[category] ?? category;
}

/**
 * 카드 등급 enum을 화면 표시명으로 변환합니다.
 *
 * @param {unknown} grade 카드 등급 enum
 * @returns {string} 등급 표시명
 */
export function getCardGradeLabel(grade) {
  if (typeof grade !== "string") return "";

  return CARD_GRADE_LABELS[grade] ?? grade;
}

/**
 * 판매 상태 enum을 화면 표시명으로 변환합니다.
 *
 * @param {unknown} status 판매 상태 enum
 * @returns {string} 판매 상태 표시명
 */
export function getSaleStatusLabel(status) {
  if (typeof status !== "string") return "";

  return SALE_STATUS_LABELS[status] ?? status;
}

/**
 * 교환 상태 enum을 화면 표시명으로 변환합니다.
 *
 * @param {unknown} status 교환 상태 enum
 * @returns {string} 교환 상태 표시명
 */
export function getExchangeStatusLabel(status) {
  if (typeof status !== "string") return "";

  return EXCHANGE_STATUS_LABELS[status] ?? status;
}
